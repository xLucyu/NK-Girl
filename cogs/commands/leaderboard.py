import discord
from discord.ext import commands
from config import GUILDID


class Test(commands.Cog):

    def __init__(self, bot):

        self.bot = bot

    @discord.slash_command(name="test", description="Sync commands", guild=discord.Object(id=int(GUILDID))) #type: ignore
    async def test(self, ctx: discord.ApplicationContext):
        
        url = "https://data.ninjakiwi.com/btd6/races/Rush_Hour_at_the_Park_m6szj540/leaderboard?page={number}"
        l1 = list(range(0,50))
        desc = ""
        for player in l1:
            desc += f"\nPlayer {str(player)} 01:50.69"


        embed = discord.Embed(title="Race Leaderboard", description=desc, color=discord.Color.blue())

        await ctx.respond(embed=embed)

    
def setup(bot):
    bot.add_cog(Test(bot))

