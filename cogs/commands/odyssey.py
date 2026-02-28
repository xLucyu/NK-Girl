import discord
from discord.ext import commands
from api import EventContext
from cogs.profile.odysseyProfile import odysseyProfile, mapsURLResolver
from components.viewMenu import SelectView
from utils.logging import EventManager
from utils.dataclasses import Odyssey, URLS, MapsData

class OdysseyCog(commands.Cog):

    def __init__(self, bot: discord.Bot):

        self.bot = bot
    
    @discord.slash_command(
        name = "odyssey",
        description = "Get Odyssey Data", 
        integration_types = {
            discord.IntegrationType.user_install,
            discord.IntegrationType.guild_install
        }
    )
    @commands.cooldown(1, 5, commands.BucketType.user)
    @discord.option(
        "difficulty",
        description = "Choose a Difficulty, default is hard.",
        choices = ["Easy", "Medium", "Hard"]
        )
    async def odyssey(self, ctx: discord.ApplicationContext, difficulty: str = "Hard") -> None:

        await ctx.response.defer()

        eventManager: EventManager = self.bot.get_cog("EventManager")
        cachedEventID = eventManager.getCurrentEventCache("Odyssey")

        context = await EventContext(
            urls = URLS["Odyssey"], 
            id = cachedEventID,
            isLeaderboard = False 
        ).buildEventContext(
            difficulty = difficulty.lower(),
            metaDataObject = Odyssey,
            subURLResolver = mapsURLResolver, 
            subResourceObject = MapsData 
        )
        
        print(context)

        eventDetails = odysseyProfile(cachedEventIndex, difficulty=difficulty.lower()) 

        embed = eventDetails["Embed"]
        names = eventDetails["Names"]
        index = eventDetails["Index"]

        data = {
            "Author": ctx.author.id,
            "EventName": "Odyssey",
            "PreviousEvents": names,
            "Function": odysseyProfile,
            "Difficulty": difficulty.lower(),
            "Index": index,
            "Message": None,
            "Emoji": "<:OdysseyCrewBtn:1338551267043180635>",
            "Button": [
                ["Easy", "easy", "success"],
                ["Medium", "medium", "primary"],
                ["Hard", "hard", "danger"]
            ]
        }
        
        view = SelectView(data)
        message = await ctx.respond(embed=embed, view=view)
        view.message = message
