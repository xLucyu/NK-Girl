import discord
from discord.ext import commands
from config import GUILDID
from cogs.profile.odysseyProfile import odysseyProfile
from utils.discord.viewmenu import SelectView

class Odyssey(commands.Cog):

    def __init__(self, bot):

        self.bot = bot
    
    @discord.slash_command(name="odyssey", description="Get Odyssey Data", guild=discord.Object(id=int(GUILDID))) #type: ignore
    @discord.option(
        "difficulty",
        description = "Choose a Difficulty, default is hard.",
        choices = ["Easy", "Medium", "Hard"]
    )
    async def odyssey(self, ctx: discord.ApplicationContext, difficulty: str = "hard"):
         
        embed, names = odysseyProfile(index=0, difficulty=difficulty.lower()) #type: ignore

        data = {
            "Author": ctx.author.id,
            "EventName": "Odyssey",
            "PreviousEvents": names,
            "Function": odysseyProfile,
            "Difficulty": difficulty.lower(),
            "Message": None,
            "Emoji": "<:OdysseyCrewBtn:1338551267043180635>>",
            "Button": [
                ["Easy", "easy", "success"],
                ["Medium", "medium", "primary"],
                ["Hard", "hard", "danger"]
            ]
        }
        
        view = SelectView(data)
        message = await ctx.respond(embed=embed, view=view)
        view.message = message
          

def setup(bot):
    bot.add_cog(Odyssey(bot))
