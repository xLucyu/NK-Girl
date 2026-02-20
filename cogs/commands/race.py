import discord
from discord.ext import commands
from cogs.profile.raceProfile import raceProfile 
from utils.discord.viewMenu import SelectView
from utils.logging.eventManager import EventManager

class Race(commands.Cog):

    def __init__(self, bot: discord.Bot):

        self.bot = bot

    @discord.slash_command(
        name="race",
        description="Show Race Data", 
        integration_types={
            discord.IntegrationType.user_install,
            discord.IntegrationType.guild_install
        }
    )
    async def race(self, ctx: discord.ApplicationContext) -> None:

        await ctx.response.defer()

        eventManager: EventManager = self.bot.get_cog("EventManager")
        cachedEventIndex = eventManager.getCurrentEventCacheIndex("Race")

        eventDetails = raceProfile(cachedEventIndex) 

        embed = eventDetails["Embed"]
        names = eventDetails["Names"]
        index = eventDetails["Index"]

        data = {
            "Author": ctx.author.id,
            "EventName": "Race",
            "PreviousEvents": names,
            "Function": raceProfile,
            "Difficulty": None,
            "Index": index,
            "Message": None,
            "Emoji": "<:EventRace:1338550190390382694>"
        }

        view = SelectView(data)
        message = await ctx.respond(embed=embed, view=view)
        view.message = message
