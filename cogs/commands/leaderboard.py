import discord 
from discord.ext import commands
from cogs.profile.leaderboardProfile import leaderboardProfile
from leaderboards.pageButtons import ButtonView

class Leaderboard(commands.Cog):
    def __init__(self, bot):

        self.bot = bot
    
    leaderboard = discord.SlashCommandGroup("leaderboard", "", integration_types={discord.IntegrationType.user_install,
                                                                                discord.IntegrationType.guild_install}) 
    @leaderboard.command(name="race", description="look up race leaderboard")
    async def race(self, ctx: discord.ApplicationContext) -> None:    

        await ctx.response.defer()
        embed, _ = leaderboardProfile(lbType="race", page=1) #type: ignore

        components = {
            "Mode": "race",
            "Author": ctx.author.id,
            "Function": leaderboardProfile,
            "Page": 1, 
            "Layout": [
                ["⬅", "-1", "primary"],
                ["➡", "1", "primary"], 
            ]
        }

        view = ButtonView(**components)
        await ctx.respond(embed=embed, view=view)


    @leaderboard.command(name="boss", description="look up boss leaderboard")
    @discord.option("difficulty", description="choose a difficulty, default is normal", choices=["Normal", "Elite"], required=False)
    @discord.option("players", description="choose a mode, default is solo", choices=[1,2,3,4], required=False)
    async def boss(self, ctx:discord.ApplicationContext, difficulty: str = "Normal", players: int = 1) -> None:
        
        await ctx.response.defer()
        if difficulty == "Normal":
            difficulty = "Standard"

        embed, teamScores = leaderboardProfile(lbType="boss", page=1, difficulty=difficulty.lower(), players=players) #type: ignore

        components = {
            "Mode": "boss",
            "Players": players,
            "SubMode": difficulty.lower(),
            "TeamScores": teamScores,   
            "Author": ctx.author.id,
            "Function": leaderboardProfile,
            "Page": 1, 
            "Layout": [
                ["⬅", "-1", "primary"],
                ["➡", "1", "primary"], 
            ]
        }

        view = ButtonView(**components)
        await ctx.respond(embed=embed, view=view) 


    
    @leaderboard.command(name="ct", description="")
    @discord.option("option", description="", choices = ["Player", "Team"], required=True)
    async def ct(self, ctx:discord.ApplicationContext, option: str) -> None:

        await ctx.response.defer()
        embed, _ = leaderboardProfile(lbType="ct", page=1, difficulty=option.lower()) #type: ignore

        components = {
            "Mode": "ct",
            "SubMode": option.lower(),
            "Author": ctx.author.id,
            "Function": leaderboardProfile,
            "Page": 1, 
            "Layout": [
                ["⬅", "-1", "primary"],
                ["➡", "1", "primary"], 
            ]
        }

        view = ButtonView(**components)
        await ctx.respond(embed=embed, view=view)

def setup(bot):
    bot.add_cog(Leaderboard(bot))
