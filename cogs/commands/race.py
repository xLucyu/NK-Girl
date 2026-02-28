import discord
from discord.ext import commands
from cogs.profile.raceProfile import raceProfile 
from components.viewMenu import SelectView
from utils.logging.eventManager import EventManager
from api.eventContext import EventContext
from utils.dataclasses import URLS

class RaceCog(commands.Cog):

    def __init__(self, bot: discord.Bot):

        self.bot = bot

    @discord.slash_command(
        name="race",
        description="Show Race Data.", 
        integration_types={
            discord.IntegrationType.user_install,
            discord.IntegrationType.guild_install
        }
    )
    async def execute(self, ctx: discord.ApplicationContext) -> None:

        await ctx.response.defer()

        eventManager: EventManager = self.bot.get_cog("EventManager")
        cachedEventID = eventManager.getCurrentEventCache("Race")

        eventContext = await EventContext(
            urls = URLS["Race"],
            id = cachedEventID,
            difficulty = "",
            isLeaderboard = False
        ).buildEventContext()

        eventDetails = raceProfile(eventContext) 

        embed = eventDetails["Embed"]
        previousEvents = eventDetails["PreviousEvents"]

        data = {
            "Author": ctx.author.id,
            "EventName": "Race",
            "EventContext": eventContext,
            "PreviousEvents": previousEvents,
            "Function": raceProfile,
            "Message": None,
            "Emoji": f"<:EventRace:{eventContext.emojiData.get("EventRace")}>"
        }

        view = SelectView(data)
        message = await ctx.respond(embed=embed, view=view)
        view.message = message
