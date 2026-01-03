import discord
from discord.ext import commands
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from cogs.profile.raceProfile import raceProfile 
from cogs.profile.bossProfile import bossProfile
from cogs.profile.odysseyProfile import odysseyProfile
from cogs.baseCommand import BaseCommand
from database.logic.guilds import GuildTable
from utils.dataclasses.main import NkData, Body


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
        "difficulties": ["Easy", "Medium", "Hard"],
        "url": "https://data.ninjakiwi.com/btd6/odyssey",
        "function": odysseyProfile
    }
}


class EventManager(commands.Cog):

    def __init__(self, bot: discord.Bot, guildTable: GuildTable):

        self.bot = bot 
        self.events = guildTable
        self.scheduler = AsyncIOScheduler()
        self.scheduler.add_job(self.checkForNewEvent, "cron", minute=0)

        self.currentEventCache: dict[str, int] = {
            "Race": 0,
            "Boss": 0,
            "Odyssey": 0
        }

    async def postLoad(self):
        
        await self.bot.wait_until_ready() 
        await self.checkForNewEvent() # run it once initially to get the cache informed

        #cogs need to be loaded first 
        if not self.scheduler.running:
            self.scheduler.start()

    
    def getCurrentEventCacheIndex(self, eventName: str) -> int:

        return self.currentEventCache[eventName]

        
    async def _saveEventCacheIndex(self, eventName: str) -> None:

        params = eventstoCheck[eventName]
        eventURL = params["url"]

        eventData = BaseCommand.useApiCall(eventURL)
        mainData = BaseCommand.transformDataToDataClass(NkData, eventData)
        index, _ = BaseCommand.getCurrentEvent(mainData)

        self.currentEventCache[eventName] = index

    
    def getRegisteredChannels(self, event: str, guildID: str = None) -> list[str] | str | None:
         
        channels = self.events.fetchAllRegisteredChannels(event)
        
        if not channels:
            return
        
        if guildID:

            for channel in channels:
                channelObject = self.bot.get_channel(int(channel))

                if not channelObject:
                    continue 
                
                return str(channelObject.id)
                
        return channels
    

    def getValidEvent(self, mainData: NkData, seenEvents: list, isManual: bool) -> tuple[int, Body] | None:

        nextEvent = BaseCommand.getCurrentEvent(mainData)

        if not nextEvent:
            return None 

        if isManual or nextEvent[1].id not in seenEvents:
            return nextEvent

        return None

    
    def getEventEmbeds(self, guildID: str = "", eventName: str = "", isManual: bool = False) -> list[discord.Embed] | None:
        
        eventEmbeds = []

        params = eventstoCheck[eventName]

        eventURL = params["url"]
        eventFunction = params["function"]
        difficulties = params["difficulties"]

        seenEvents = [] if isManual else self.events.fetchEventIds(eventName, guildID)

        eventData = BaseCommand.useApiCall(eventURL)
        mainData = BaseCommand.transformDataToDataClass(NkData, eventData)
        validEvent = self.getValidEvent(mainData, seenEvents, isManual)

        if not validEvent:
            return

        index, eventMetaData = validEvent

        for difficulty in difficulties:

            if difficulty:
                difficulty = difficulty.lower()

            eventData = eventFunction(index, difficulty)
            eventEmbeds.append(eventData.get("Embed"))

        if eventMetaData.id not in seenEvents:
            self.events.appendEvent(eventMetaData.id, eventName, guildID)
         
        return eventEmbeds

        
    async def checkForNewEvent(self):

        for eventName in eventstoCheck:

            await self._saveEventCacheIndex(eventName)

            registeredChannels = self.getRegisteredChannels(eventName)

            if not registeredChannels:
                continue

            for channel in registeredChannels:

                try:
                    channelObject = await self.bot.fetch_channel(int(channel))

                    if not channelObject:
                        continue

                    guildID = str(channelObject.guild.id)
                    eventEmbeds = self.getEventEmbeds(eventName=eventName, guildID=guildID)

                    if not eventEmbeds:
                        continue

                    message = await channelObject.send(embeds=eventEmbeds)

                    if channelObject.type == discord.ChannelType.news:
                        await message.publish()

                except Exception:
                    continue


