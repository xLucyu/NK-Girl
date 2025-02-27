import discord 
from discord.ext import commands
from cogs.profile.bossProfile import bossProfile
from utils.discord.viewmenu import SelectView

class Boss(commands.Cog):
    def __init__(self, bot):

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
