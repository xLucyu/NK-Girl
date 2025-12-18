import discord
from discord.ext import commands
from cogs.profile.odysseyProfile import odysseyProfile
from utils.discord.viewMenu import SelectView


class Odyssey(commands.Cog):

    def __init__(self, bot: discord.Bot):

        self.bot = bot
    
    @discord.slash_command(name="odyssey", description="Get Odyssey Data", 
                           integration_types={discord.IntegrationType.user_install,
                                              discord.IntegrationType.guild_install})
    @commands.cooldown(1, 5, commands.BucketType.user)
    @discord.option(
        "difficulty",
        description = "Choose a Difficulty, default is hard.",
        choices = ["Easy", "Medium", "Hard"]
        )
    async def odyssey(self, ctx: discord.ApplicationContext, difficulty: str = "Hard") -> None:

        await ctx.response.defer()

        embed, names = odysseyProfile(index=None, difficulty=difficulty.lower()) 

        data = {
            "Author": ctx.author.id,
            "EventName": "Odyssey",
            "PreviousEvents": names,
            "Function": odysseyProfile,
            "Difficulty": difficulty.lower(),
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
