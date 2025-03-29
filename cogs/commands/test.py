import discord 
from discord.ext import commands
from cogs.profile.testProfile import testProfile 

class Leaderboard(commands.Cog):
    def __init__(self, bot):

        self.bot = bot
    
    leaderboard = discord.SlashCommandGroup("leaderboard", "", integration_types={discord.IntegrationType.user_install,
                                                                                discord.IntegrationType.guild_install})
    
    @leaderboard.command(name="race", description="look up race leaderboard")
    async def race(self, ctx: discord.ApplicationContext):    

        await ctx.response.defer()
        embed = testProfile(lbType="race", page=1)
        await ctx.respond(embed=embed)



    @leaderboard.command(name="boss", description="look up boss leaderboard")
    @discord.option("difficulty", description="choose a difficulty, default is normal", choices=["Normal", "Elite"], required=False)
    @discord.option("players", description="choose a mode, default is solo", choices=[1,2,3,4], required=False)
    async def boss(self, ctx:discord.ApplicationContext, difficulty: str = "Normal", players: int = 1):
        
        await ctx.response.defer() #coop boss lbs take some time lol
        if difficulty == "Normal":
            difficulty = "Standard"

        embed = testProfile(lbType="boss", page=1, difficulty=difficulty.lower(), players=players)
        await ctx.respond(embed=embed)


    
    @leaderboard.command(name="ct", description="")
    @discord.option("option", description="", choices = ["Player", "Team"], required=True)
    async def ct(self, ctx:discord.ApplicationContext, option: str):

        await ctx.response.defer()
        embed = testProfile(lbType="ct", page=1, difficulty=option.lower())
        await ctx.respond(embed=embed)



def setup(bot):
    bot.add_cog(Leaderboard(bot))
