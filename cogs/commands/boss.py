import discord 
from discord.ext import commands
from cogs.profile import bossProfile
from components.viewMenu import SelectView
from utils.logging import EventManager
from utils.dataclasses import (
    URLS,
    MetaData,
    ViewContext
)
from api.eventContext import EventContext


class BossCog(commands.Cog):

    def __init__(self, bot: discord.Bot):

        self.bot = bot
    
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

        context = await EventContext(
            urls = URLS["Boss"], 
            id = cachedEventID,
            isLeaderboard = False 
        ).buildEventContext(
            difficulty = difficulty.lower(),
            metaDataObject = MetaData 
        ) 
 
        eventDetails = bossProfile(context) 

        data = ViewContext(
            userID = ctx.author.id, 
            eventContext = context,
            eventName = "Boss",
            metaDataObject = MetaData,
            previousEvents = eventDetails.previousEvents,
            function = bossProfile,
            message = None,
            emoji = f"<:BossChallenge:{emojis.get("BossChallenge")}>", 
            buttonLayout = [
                ["Normal", "standard", "success"],
                ["Elite", "elite", "danger"]
            ]
        )

        view = SelectView(data)
        message = await ctx.respond(embed=eventDetails.embed, view=view)
        view.message = message   


