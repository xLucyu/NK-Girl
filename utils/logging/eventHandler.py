import discord 
from discord.ext import commands 
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime, timezone
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
        "difficulties": ["Easy", "Medium", "Hard"],
        "url": "https://data.ninjakiwi.com/btd6/odyssey",
        "function": odysseyProfile
    }
}


class EventHandler(commands.Cog):

    def __init__(self, bot: discord.Bot):

        self.bot = bot 
        self.events = EventTable()
        self.schedueler = AsyncIOScheduler()
    #  self.schedueler.add_job(self.checkForNewEvent, "interval", seconds=60)
     
    async def postLoad(self):
        #cogs need to be loaded first
        await self.checkForNewEvent()
        if not self.schedueler.running:
            self.schedueler.start()

    async def checkForNewEvent(self, guildID = None, eventName = None, isManual = False):

        currentTime = datetime.now(timezone.utc).timestamp() * 1000
         
        for event, params in eventstoCheck.items(): 

            if eventName and event != eventName:
                continue 

            eventURL = params["url"]
            eventFunction = params["function"]
            eventData = BaseCommand.useApiCall(eventURL)
            mainData = BaseCommand.transformDataToDataClass(NkData, eventData)

            registeredChannels = self.events.fetchAllRegisteredGuilds(event)
            print(event, registeredChannels)

            if guildID:
                registeredChannels = [
                    channel for channel in registeredChannels
                    if str(self.bot.get_channel(int(channel)).guild.id) == str(guildID)
                ]

            for channel in registeredChannels:
 
                channelID = await self.bot.fetch_channel(int(channel)) 

                if not channelID:
                    continue 

                currentGuildID = str(channelID.guild.id)
                seenEvents = [] if isManual else self.events.fetchEventIds(event, currentGuildID) 

                validEvents = [
                    (index, eventBody)
                    for index, eventBody in enumerate(mainData.body)
                    if eventBody not in seenEvents and currentTime < eventBody.end 
                ]
                
                targetEventIndex = min(validEvents, key=lambda event: event[1].end, default=None)

                if not targetEventIndex:
                    continue 

                eventEmbeds = []

                for difficulty in params["difficulties"]:

                    if difficulty: 
                        difficulty = difficulty.lower()
                 
                    embed, _ = eventFunction(targetEventIndex[0], difficulty)
                    eventEmbeds.append(embed)
                
                message = await channelID.send(embeds=eventEmbeds)

                if channelID.type == discord.ChannelType.news:
                    await message.publish()

                if targetEventIndex[1].id not in seenEvents:
                    self.events.appendEvent(targetEventIndex[1].id, event, guildID) 

    @discord.slash_command(name="post", description="post an event manually")
    @discord.option(
        "event",
        description = "choose the event you want to post",
        choices = ["Race", "Odyssey", "Boss"],
        required = True 
    )
    async def post(self, ctx: discord.ApplicationContext, event: str):
       
        if not ctx.author.guild_permissions.manage_guild:
            await ctx.respond(
                "You don't have permission to run this command (requires Manage Server).",
                ephemeral=True
            )
            return

        await ctx.response.defer()

        # Check if any channel exists for this event in the guild
        registeredChannels = self.events.fetchAllRegisteredGuilds(event)
        guildChannels = [
            ch for ch in registeredChannels
            if str(self.bot.get_channel(int(ch)).guild.id) == str(ctx.guild.id)
        ]
        if not guildChannels:
            await ctx.respond(
                f"No channel has been set for **{event}** in this server.",
                ephemeral=True
            )
            return

        # Try posting the event
        try:
            await self.checkForNewEvent(ctx.guild.id, event, isManual=True)
            await ctx.respond(f"Successfully posted **{event}** for this server.")
        except Exception as e:
            await ctx.respond(
                f"Something went wrong while posting **{event}**.\nError: `{e}`",
                ephemeral=True
            )

def setup(bot: discord.Bot):
    bot.add_cog(EventHandler(bot))
