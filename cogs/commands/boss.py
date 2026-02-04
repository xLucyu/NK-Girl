import discord 
from discord.ext import commands
from cogs.profile.bossProfile import bossProfile
from utils.discord.viewMenu import SelectView
from utils.logging.eventManager import EventManager
from api.eventContext import EventContext
from utils.dataclasses import EventURLs

class Boss(commands.Cog):

    def __init__(self, bot: discord.Bot):

        self.bot = bot
    
    @discord.slash_command(name="boss", description="Show Boss Data", 
                           integration_types = {discord.IntegrationType.user_install,
                                                discord.IntegrationType.guild_install})
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
        cachedEventIndex = eventManager.getCurrentEventCacheIndex("Boss")

        context = await EventContext(
            urls=EventURLs["boss"],
            index=cachedEventIndex,
            difficulty=difficulty
        ).buildEventContext()
 
        if difficulty == "Normal":
            difficulty = "Standard"
 
        eventDetails = bossProfile(context, difficulty=difficulty.lower())  

        embed = eventDetails["Embed"]
        names = eventDetails["Names"]
        index = eventDetails["Index"]

        data = {
            "Author": ctx.author.id, 
            "EventName": "Boss",
            "PreviousEvents": names,
            "Function": bossProfile,
            "Difficulty": difficulty.lower(),
            "Message": None,
            "Index": index,
            "Emoji": "<:BossChallenge:1338550202889404487>", 
            "Button": [
                    ["Normal", "standard", "success"],
                    ["Elite", "elite", "danger"]
                ]
            }

        view = SelectView(data)
        message = await ctx.respond(embed=embed, view=view)
        view.message = message   
