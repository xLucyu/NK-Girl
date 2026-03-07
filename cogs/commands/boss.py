import discord 
from discord.ext import commands
from api.eventContext import EventContext
from cogs.profile import bossProfile
from components.viewMenu import SelectView
from utils.logging import EventManager
from utils.dataclasses import (
    URLS,
    MetaData,
    ViewContext
)


class BossCog(commands.Cog):

    def __init__(self, bot: discord.Bot):

        self.bot = bot
        self.eventContext = EventContext(
            urls = URLS["Boss"],
            isLeaderboard = False 
        )
    
    @discord.slash_command(
        name = "boss", 
        description = "Show Boss Data", 
        integration_types = {
            discord.IntegrationType.user_install,
            discord.IntegrationType.guild_install
        }
    )
    @commands.cooldown(1, 5, commands.BucketType.user)
    @discord.option(
        "difficulty",
        description = "Choose a difficulty, default is Normal.",
        choices = ["Normal", "Elite"],
        required = True
        )
    async def execute(self, ctx: discord.ApplicationContext, difficulty: str = "Normal") -> None:

        await ctx.response.defer()
 
        eventManager: EventManager = self.bot.get_cog("EventManager")
        cachedEventID = eventManager.getCurrentEventCache("Boss")

        if difficulty == "Normal":
            difficulty = "Standard"

        eventData = self.eventContext.buildEventContext(
            id = cachedEventID,
            difficulty = difficulty.lower(),
            metaDataObject = MetaData 
        ) 
 
        eventDetails = bossProfile(eventData) 

        viewContext = ViewContext(
            userID = ctx.author.id,
            eventID = cachedEventID, 
            eventContext = self.eventContext,
            eventData = eventData,
            eventName = "Boss",
            metaDataObject = MetaData,
            previousEvents = eventDetails.previousEvents,
            function = bossProfile,
            message = None,
            emoji = f"<:BossChallenge:{eventContext.emojiData.get("BossChallenge")}>", 
            buttonLayout = [
                ["Normal", "standard", "success"],
                ["Elite", "elite", "danger"]
            ]
        )

        view = SelectView(viewContext)
        message = await ctx.respond(embed=eventDetails.embed, view=view)
        view.message = message   
