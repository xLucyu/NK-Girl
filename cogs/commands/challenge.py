import discord 
from discord.ext import commands
from cogs.profile.challengeProfile import challengeProfile
from utils.discord.viewMenu import SelectView

class Challenge(commands.Cog):
    def __init__(self, bot: discord.Bot):

        self.bot = bot

    challenge = discord.SlashCommandGroup("challenge", "", integration_types={discord.IntegrationType.user_install,
                                                                              discord.IntegrationType.guild_install})

    @challenge.command(name="lookup", description="look up a challenge",
                       integration_types = {discord.IntegrationType.user_install,
                                             discord.IntegrationType.guild_install}) 
    @discord.option(
        "code",
        description = "Enter a challenge code", 
        required = True) 
    async def lookup(self, ctx:discord.ApplicationContext, code: str) -> None:

        embed, _ = challengeProfile(index=code.upper()) #type: ignore
        await ctx.respond(embed=embed)


    @challenge.command(name="daily", description="Get the current daily challenge.",
                       integration_types = {discord.IntegrationType.user_install,
                                            discord.IntegrationType.guild_install})
    @discord.option(
        "difficulty",
        description = "Enter the type of daily challenge, default is Advanced.",
        choices = ["Standard", "Advanced", "Co-op"],
        required = False
        )
    async def daily(self, ctx:discord.ApplicationContext, difficulty: str = "Advanced") -> None:

        if difficulty == "Co-op":
            difficulty = "coop"
        
        embed, _ = challengeProfile(index=None, difficulty=difficulty.lower()) #type: ignore

        data = {
            "Author": ctx.author.id, 
            "EventName": None,
            "Function": challengeProfile,
            "Difficulty": difficulty.lower(),
            "Message": None,
            "Emoji": "<:Coop:1341515962410598521>", 
            "Button": [
                    ["Standard", "standard", "success"],
                    ["Advanced", "advanced", "primary"],
                    ["Co-op", "coop", "danger"]
                ]
            }

        view = SelectView(data)
        message = await ctx.respond(embed=embed, view=view)
        view.message = message

def setup(bot: discord.Bot):
    bot.add_cog(Challenge(bot))
