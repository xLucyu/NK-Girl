import discord
from discord.ext import commands
from cogs.profile.raceProfile import raceProfile 
from utils.discord.viewMenu import SelectView


class Race(commands.Cog):

    def __init__(self, bot: discord.Bot):

        self.bot = bot

    @discord.slash_command(name="race", description="Show Race Data", 
                           integration_types={discord.IntegrationType.user_install,
                                              discord.IntegrationType.guild_install})
    async def race(self, ctx: discord.ApplicationContext) -> None:
        await ctx.response.defer() 

        embed, names = raceProfile(index=None, difficulty=None) 

        data = {
            "Author": ctx.author.id,
            "EventName": "Race",
            "PreviousEvents": names,
            "Function": raceProfile,
            "Difficulty": None,
            "Message": None,
            "Emoji": "<:EventRace:1338550190390382694>"
        }

        view = SelectView(data)
        message = await ctx.respond(embed=embed, view=view)
        view.message = message
