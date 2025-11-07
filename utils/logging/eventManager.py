import discord, typing
from discord.ext import commands
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime, timezone
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

    def __init__(self, bot: discord.Bot):

        self.bot = bot 
        self.events = GuildTable()
        self.scheduler = AsyncIOScheduler()
        self.scheduler.add_job(self.checkForNewEvent, "cron", minute=0)

    event = discord.SlashCommandGroup(
        "event", 
        "",
        integration_types={
            discord.IntegrationType.guild_install
        },
        default_member_permission=discord.Permissions(manage_guild=True)
    )
     
    async def postLoad(self):

        #cogs need to be loaded first
        if not self.scheduler.running:
            self.scheduler.start()

    
    def getRegisteredChannels(self, event: str, guildID: str = None) -> list[str]:

        channels = self.events.fetchAllRegisteredChannels(event)

        if guildID:

            return [
                channel for channel in channels
                if str(self.bot.get_channel(int(channel)).guild.id) == str(guildID)
            ]

        return channels
    

    def getValidEvent(self, mainData: NkData, seenEvents: list, currentTime: str, isManual: bool) -> tuple[int, Body] | None:

        validEvents = [
            (index, eventBody)
            for index, eventBody in enumerate(mainData.body)
            if eventBody.id not in seenEvents and currentTime < eventBody.end
        ] 

        targetEvent = min(validEvents, key=lambda event: event[1].end, default=None)

        if isManual and not validEvents:
            targetEvent = (0, mainData.body[0])

        if not targetEvent:
            return
        
        return targetEvent

    
    def getEventEmbeds(
            self, 
            guildID: str = None,
            eventName: str = None,
            isManual: bool = None
    ) -> dict[str, typing.Union[list[discord.Embed], str, list[str]]]:
        
        currentTime = datetime.now(timezone.utc).timestamp() * 1000
        eventEmbeds = []

        params = eventstoCheck[eventName]

        eventURL = params["url"]
        eventFunction = params["function"]
        difficulties = params["difficulties"]

        seenEvents = [] if isManual else self.events.fetchEventIds(eventName, guildID)

        eventData = BaseCommand.useApiCall(eventURL)
        mainData = BaseCommand.transformDataToDataClass(NkData, eventData)
        index, eventMetaData = self.getValidEvent(mainData, seenEvents, currentTime, isManual)

        for difficulty in difficulties:

            if difficulty:
                difficulty = difficulty.lower()

            embed, _ = eventFunction(index, difficulty)
            eventEmbeds.append(embed)
            
        return {
            "Embeds": eventEmbeds, 
            "EventID": eventMetaData.id,
            "SeenEvents": seenEvents
        }
    
        
    async def checkForNewEvent(self):

        for eventName in eventstoCheck: 

            registeredChannels = self.getRegisteredChannels(eventName)

            for channel in registeredChannels:
                
                channelObject = await self.bot.fetch_channel(int(channel))

                if not channelObject:
                    continue

                guildID = str(channelObject.guild.id)
                currentEventInfo = self.getEventEmbeds(eventName=eventName, guildID=guildID)

                message = await channelObject.send(embeds=currentEventInfo["Embeds"])

                if channelObject.type == discord.ChannelType.news:
                    await message.publish()

                if currentEventInfo["EventID"] not in currentEventInfo["SeenEvents"]:
                    self.events.appendEvent(currentEventInfo["EventID"], eventName, guildID)


    @event.slash_command(name="post", description="post an event manually")
    @event.option(
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
        
    @event.slash_command(name="edit", description="overwrite an already existing message posted by the bot")
    @event.option(
        "message_id",
        description = "enter the id for the message you want to change",
        required = True 
    )
    @event.option(
        "event",
        description = "choose the event you want to post",
        choices = ["Race", "Odyssey", "Boss"],
        required = True 
    )
    async def edit(self, message_id: str, event: str):
        pass

def setup(bot: discord.Bot):
    bot.add_cog(EventManager(bot))
