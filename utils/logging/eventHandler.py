import discord 
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime, timezone
from discord.ext import commands 
from cogs.profile.raceProfile import raceProfile 
from cogs.profile.bossProfile import bossProfile
from cogs.profile.odysseyProfile import odysseyProfile
from cogs.baseCommand import BaseCommand
from database.channels.index import EventTable
from utils.dataclasses.main import NkData

eventstoCheck = {
    "Race": {
        "difficulties": [None],
        "url": "https://data.ninjakiwi.com/btd6/races",
        "function": raceProfile
    },
    "Boss": {
        "difficulties": ["Standard", "Elite"],
        "url": "https://data.ninjakiwi.com/btd6/bosses",
        "function": bossProfile
    },
    "Odyssey": {
        "difficulties": ["Easy", "Normal", "Hard"],
        "url": "https://data.ninjakiwi.com/btd6/odyssey",
        "function": odysseyProfile
    }
}


class EventHandler(commands.Cog):

    def __init__(self, bot: discord.Bot):

        self.bot = bot 
        self.events = EventTable()
        self.schedueler = AsyncIOScheduler()
        self.schedueler.add_job(self.checkForNewEvent, "cron", minute=0)
     
    async def postLoad(self):
        #cogs need to be loaded first
        if not self.schedueler.running:
            self.schedueler.start()
        

    async def checkForNewEvent(self):

        currentTime = datetime.now(timezone.utc).timestamp() * 1000
        
        for event, params in eventstoCheck.items():

            eventURL = params["url"]
            eventFunction = params["function"]
            eventData = BaseCommand.useApiCall(eventURL)
            mainData = BaseCommand.transformDataToDataClass(NkData, eventData)

            seenEvents = self.events.fetchEventIds(event)
            
            validEvents = [
                (index, eventID)
                for index, eventID in enumerate(mainData.body)
                if eventID not in seenEvents and currentTime < eventID.end
            ]

            targetEventIndex = min(validEvents, key=lambda event: event[1].end, default=None)

            if targetEventIndex:
                
                eventEmbeds = []
                registeredChannels = self.events.fetchAllRegisteredGuilds(event)

                for difficulty in params["difficulties"]:
                    eventEmbeds.append(eventFunction(targetEventIndex, difficulty))

                for channel in registeredChannels:
                    channelID = self.bot.get_channel(int(channel))
                    await channelID.send(embeds=eventEmbeds)


def setup(bot: discord.Bot):
    bot.add_cog(EventHandler(bot))
