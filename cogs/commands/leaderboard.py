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
        lbData = leaderboardProfile(lbType="race", page=1)

        components = {
            "Mode": "race",
            "TotalScores": lbData.get("TotalScores"),
            "Author": ctx.author.id,
            "Function": leaderboardProfile,
            "Page": 1, 
            "Message": None,
            "URL": lbData.get("LeaderboardURL"),
            "Layout": [
                ["⬅️", "-1", "primary"],
                ["➡️", "1", "primary"],
                ["Search", "searchPlayer", "primary"],
                ["Page", "searchPage", "primary"]
            ]
        }

        view = ButtonView(**components)
        message = await ctx.respond(embed=lbData.get("Embed"), view=view)
        view.message = message 

    @leaderboard.command(name="boss", description="look up boss leaderboard")
    @discord.option(
        "difficulty", 
        description="choose a difficulty, default is normal", 
        choices=["Normal", "Elite"], 
        required=False
        )
    @discord.option(
        "players", 
        description="choose a mode, default is solo", 
        choices=[1,2,3,4], 
        required=False
        )
    async def boss(self, ctx:discord.ApplicationContext, difficulty: str = "Normal", players: int = 1) -> None:
        await ctx.response.defer()

        if difficulty == "Normal":
            difficulty = "Standard"

        lbData = leaderboardProfile(lbType="boss", page=1, difficulty=difficulty.lower(), players=players)

        components = {
            "Mode": "boss",
            "TotalScores": lbData.get("TotalScores"),
            "ScoreType": lbData.get("scoreType"),
            "Players": players,
            "SubMode": difficulty.lower(),
            "TeamScores": lbData.get("teamScores"),   
            "Author": ctx.author.id,
            "Function": leaderboardProfile,
            "Page": 1, 
            "Message": None,
            "URL": lbData.get("LeaderboardURL"),
            "Layout": [
                ["⬅️", "-1", "primary"],
                ["➡️", "1", "primary"],
                ["Search", "searchPlayer", "primary"],
                ["Page", "searchPage", "primary"]
            ]
        }

        view = ButtonView(**components)
        message = await ctx.respond(embed=lbData.get("Embed"), view=view) 
        view.message = message
  
    @leaderboard.command(name="ct", description="")
    @discord.option("option", description="", choices = ["Player", "Team"], required=True)
    async def ct(self, ctx:discord.ApplicationContext, option: str) -> None:

        await ctx.response.defer()
        lbData = leaderboardProfile(lbType="ct", page=1, difficulty=option.lower()) 

        components = {
            "Mode": "ct",
            "TotalScores": lbData.get("TotalScores"),
            "SubMode": option.lower(),
            "Author": ctx.author.id,
            "Function": leaderboardProfile,
            "Page": 1,
            "Message": None,
            "URL": lbData.get("LeaderboardURL"),
            "Layout": [
                ["⬅️", "-1", "primary"],
                ["➡️", "1", "primary"],
                ["Search", "searchPlayer", "primary"],
                ["Page", "searchPage", "primary"]
            ]
        }
        
        view = ButtonView(**components)
        message = await ctx.respond(embed=lbData.get("Embed"), view=view)
        view.message = message

def setup(bot: discord.Bot):
    bot.add_cog(Leaderboard(bot))
