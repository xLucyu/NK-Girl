import discord 
from discord.ext import commands
from cogs.profile import bossProfile
from components.viewMenu import SelectView
from utils.logging.eventManager import EventManager
from utils.dataclasses import URLS
from api.eventContext import EventContext


class Boss(commands.Cog):

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
        cachedEventID = eventManager.getCurrentEventCacheIndex("Boss")

        if difficulty == "Normal":
            difficulty = "Standard"

        context = await EventContext(
            urls = URLS["Boss"]

        ) 
 
 
        eventDetails = bossProfile(context)  

        embed = eventDetails["Embed"]
        previousEvents = eventDetails["PreviousEvents"]

        data = {
            "Author": ctx.author.id, 
            "EventContext": context,
            "EventName": "Boss",
            "PreviousEvents": previousEvents,
            "Function": bossProfile,
            "Message": None,
            "Emoji": "<:BossChallenge:1338550202889404487>", 
            "Button": [
                    ["Normal", "standard", "success"],
                    ["Elite", "elite", "danger"]
                ]
            }

        view = SelectView(data)
        message = await ctx.respond(embed=embed, view=view)
        view.message = message   


