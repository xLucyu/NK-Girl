import discord 
from discord.ext import commands 

class Leaderboard(commands.Cog):
    def __init__(self, bot):

        self.bot = bot
    
    leaderboard = discord.SlashCommandGroup("leaderboard", "", guild=discord.Object(id=1349497540206399548))
    
    @leaderboard.command(name="race", description="look up race leaderboard")
    async def race(self, ctx: discord.ApplicationContext):      

        await ctx.respond("race")

    @leaderboard.command(name="boss", description="")
    async def boss(self, ctx:discord.ApplicationContext):

        await ctx.respond("boss")

    
    @leaderboard.command(name="ct", description="")
    @discord.option("option", description="", choices = ["Players", "Teams"], required=True)
    async def ct(self, ctx:discord.ApplicationContext, option: str):

        await ctx.respond(option)

def setup(bot):
    bot.add_cog(Leaderboard(bot))
