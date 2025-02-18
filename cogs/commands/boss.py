import discord 
from discord.ext import commands
from config import GUILDID
from cogs.profile.bossProfile import bossProfile
from utils.discord.viewmenu import SelectView

class Boss(commands.Cog):
    def __init__(self, bot):

        self.bot = bot
    
    @discord.slash_command(name="boss", description="Show Boss Data", guild=discord.Object(id=int(GUILDID))) #type: ignore
    @discord.option(
        "difficulty",
        description = "Choose a difficulty, default is Normal.",
        choices = ["Normal", "Elite"],
        required = True
    )
    async def boss(self, ctx: discord.ApplicationContext, difficulty: str = "Normal"): 
        
        if difficulty == "Normal":
            difficulty = "Standard"
         
        embed, names = bossProfile(index=0, difficulty=difficulty.lower()) #type: ignore 

        data = {
            "Author": ctx.author.id, 
            "EventName": ["Boss"],
            "PreviousEvents": [names],
            "Function": bossProfile,
            "Difficulty": difficulty.lower(),
            "Message": None,
            "Emoji": ["<:BossChallenge:1338550202889404487>"], 
            "Button": [
                    ["Normal", "standard", "success"],
                    ["Elite", "elite", "danger"]
                ]
            }

        view = SelectView(data)
        message = await ctx.respond(embed=embed, view=view)
        view.message = message   


def setup(bot):
    bot.add_cog(Boss(bot))
