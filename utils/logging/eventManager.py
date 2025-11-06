import discord  
from discord.ext import commands
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime, timezone
from cogs.profile.raceProfile import raceProfile 
from cogs.profile.bossProfile import bossProfile
from cogs.profile.odysseyProfile import odysseyProfile
from cogs.baseCommand import BaseCommand
from database.logic.guilds import GuildTable
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
        "difficulties": ["Easy", "Medium", "Hard"],
        "url": "https://data.ninjakiwi.com/btd6/odyssey",
        "function": odysseyProfile
    }
}


class EventManager(commands.Cog):

    def __init__(self, bot: discord.Bot):

        self.bot = bot 
        self.events = GuildTable()
        self.scheduler = AsyncIOScheduler()
        self.scheduler.add_job(self.checkForNewEvent, "interval", seconds=60)
     
    async def postLoad(self):

        #cogs need to be loaded first
        if not self.scheduler.running:
            self.scheduler.start()

    def getRegisteredChannels(self, event: str, guildID = None) -> list[str]:

        channels = self.events.fetchAllRegisteredChannels(event)

        if guildID:

            return [
                channel for channel in channels
                if str(self.bot.get_channel(int(channel)).guild.id) == str(guildID)
            ]

        return channels

    
    async def checkForNewEvent(self, guildID = None, eventName= None, isManual = None) -> None:
        
        print("hello")
        currentTime = datetime.now(timezone.utc).timestamp() * 1000

        for event, params in eventstoCheck.items():

            if eventName and event != eventName:
                continue

            eventDifficulties = params["difficulties"]
            eventURL = params["url"]
            eventFunction = params["function"]

            eventData = BaseCommand.useApiCall(eventURL)
            mainData = BaseCommand.transformDataToDataClass(NkData, eventData)

            registeredChannels = self.getRegisteredChannels(event, guildID)  

            for channel in registeredChannels:

                channelID = await self.bot.fetch_channel(int(channel))
                
                if not channelID:
                    continue
                
                currentGuildID = str(channelID.guild.id)

                seenEvents = [] if isManual else self.events.fetchEventIds(event, currentGuildID)

                validEvents = [
                    (index, eventBody)
                    for index, eventBody in enumerate(mainData.body)
                    if eventBody.id not in seenEvents and currentTime < eventBody.end
                ] 

                targetEvent = min(validEvents, key=lambda event: event[1].end, default=None)

                if isManual and not validEvents:
                    targetEvent = (0, mainData.body[0])

                if not targetEvent:
                    continue 

                eventEmbeds = []

                for difficulty in eventDifficulties:

                    if difficulty:
                        difficulty = difficulty.lower()

                    embed, _ = eventFunction(targetEvent[0], difficulty)
                    eventEmbeds.append(embed)

                message = await channelID.send(embeds=eventEmbeds)

                if channelID.type == discord.ChannelType.news:
                    await message.publish()
                
                if targetEvent[1].id not in seenEvents:
                    self.events.appendEvent(targetEvent[1].id, event, currentGuildID)
                

    @discord.slash_command(name="post", description="post an event manually")
    @discord.option(
        "event",
        description = "choose the event you want to post",
        choices = ["Race", "Odyssey", "Boss"],
        required = True 
    )
    async def post(self, ctx: discord.ApplicationContext, event: str):

        await ctx.response.defer() 

        if not ctx.author.guild_permissions.manage_guild:
            await ctx.respond("You don't have permission to run this command.", ephemeral = True)
            return 
        
        currentGuildChannel = self.getRegisteredChannels(event, str(ctx.guild.id))

        if not currentGuildChannel:
            await ctx.respond(f"No Channel has been set for {event} in this server.", ephemeral = True)
            return
        
        try:

            await self.checkForNewEvent(str(ctx.guild.id), event, isManual=True)
            await ctx.respond(f"Succesfully posted **{event}** in this server.")

        except Exception as e:
            raise ValueError(e)


def setup(bot: discord.Bot):
    bot.add_cog(EventManager(bot))
