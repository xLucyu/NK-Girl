import discord 
from discord.ext import commands
from api import EventContext
from cogs.profile.bossdetailsProfile import bossdetailsProfile
from components.viewMenu import SelectView
from utils.logging import EventManager
from utils.dataclasses import URLS

class BossDetails(commands.Cog):

    def __init__(self, bot: discord.Bot):
        self.bot = bot

    @discord.slash_command(
        name = "bossdetails",
        description = "Show details about the current Boss.",
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
        required = False
        )
    @discord.option(
        "players",
        description = "Choose the mode, default is solo.",
        choices = [1, 2, 3, 4],
        required = False
        )
    @discord.option(
        "boss",
        description = "Choose a boss, if you don't choose one, it will display the current events one.",
        choices = [
            "Bloonarius",
            "Lych",
            "Vortex",
            "Dreadbloon",
            "Phayze",
            "Blastapopoulos"
        ],
        required = False 
    )
    @discord.option(
        "multiplier",
        description = "Choose a health multiplier, this is optional. Will show on the event boss too, if you select it.",
        required = False
    )
    async def execute(
        self,
        ctx: discord.ApplicationContext, 
        difficulty: str = "Normal", 
        players: int = 1, 
        boss: str = "", 
        multiplier: float = 0.0
    ) -> None:

        await ctx.response.defer()
 
        eventManager: EventManager = self.bot.get_cog("EventManager")
        cachedEventID = eventManager.getCurrentEventCache("Boss")

        if difficulty == "Normal":
            difficulty = "Standard"

        eventContext = await EventContext(
            urls = URLS["Boss"],
            id = cachedEventID,
            difficulty = difficulty,
            isLeaderboard = False
        ).buildEventContext()

        eventDetails = bossdetailsProfile(eventContext, players, boss, multiplier)

        embed = eventDetails["Embed"]
        modes = eventDetails["PreviousEvents"]

        data = {
            "Author": ctx.author.id, 
            "EventName": "Coop Mode",
            "PreviousEvents": modes,
            "Function": bossdetailsProfile,
            "Difficulty": difficulty.lower(),
            "Message": None,
            "PlayerCount": players,
            "HpMultiplier": multiplier,
            "Emoji": "<:Coop:1341515962410598521>",
            "Boss": boss, 
            "Button": [
                    ["Normal", "STANDARD", "success"], 
                    ["Elite", "ELITE", "danger"]
                ]
            }
         
        view = SelectView(data)
        message = await ctx.respond(embed=embed, view=view)
        view.message = message   
