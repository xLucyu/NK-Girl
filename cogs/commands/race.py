import discord
from discord.ext import commands
from config import GUILDID
from cogs.profile.raceProfile import raceProfile 
from utils.discord.viewmenu import SelectView


class Race(commands.Cog):

    def __init__(self, bot):

        self.bot = bot


    @discord.slash_command(name="race", description="Show Race Data", guild=discord.Object(id=int(GUILDID))) #type: ignore 
    async def race(self, ctx: discord.ApplicationContext):
         
        embed, names = raceProfile(index=0, difficulty=None) #type: ignore

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

def setup(bot):
    bot.add_cog(Race(bot))
