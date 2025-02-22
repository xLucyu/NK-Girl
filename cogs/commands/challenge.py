import discord 
from discord.ext import commands
from config import GUILDID
from cogs.profile.challengeProfile import challengeProfile

class Challenge(commands.Cog):

    def __init__(self, bot):

        self.bot = bot

    challenge = discord.SlashCommandGroup("challenge", "")

    @challenge.command(name="lookup", description="look up a challenge", guild=discord.Object(id=int(GUILDID)))
    @discord.option(
        "code",
        description = "Enter a challenge code",
        required = True
    )
    async def lookup(self, ctx:discord.ApplicationContext, code: str):

        embed = challengeProfile(index=code)
        await ctx.respond(embed=embed)

    @challenge.command(name="daily", description="look up a challenge", guild=discord.Object(id=int(GUILDID)))
    @discord.option(
            "difficulty",
            description = "Enter the type of daily challenge, default is Advanced.",
            choices = ["Standard", "Advanced", "Co-op"],
            required = False
        )
    async def daily(self, ctx:discord.ApplicationContext, difficulty: str = "Advanced"):

        if difficulty == "Co-op":
            difficulty = "coop"
        
        embed = challengeProfile(index=None, difficulty=difficulty)
        await ctx.respond(embed=embed)

def setup(bot):
    bot.add_cog(Challenge(bot))
