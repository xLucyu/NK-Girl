import discord 
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from discord.ext import commands 
from cogs.commands.race import Race 
from cogs.commands.boss import Boss 
from cogs.commands.odyseyy import Odyssey
from cogs.baseCommand import BaseCommand
from database.channels.index import EventTable
from utils.dataclasses.main import NkData

eventstoCheck = {
    "Race": {
        "difficulties": [None],
        "url": "https://data.ninjakiwi.com/btd6/races",
        "column": "RaceProps"
    },
    "Boss": {
        "difficulties": ["Standard", "Elite"],
        "url": "https://data.ninjakiwi.com/btd6/bosses",
        "column": "BossProps"
    },
    "Odyssey": {
        "difficulties": ["Easy", "Normal", "Hard"],
        "url": "https://data.ninjakiwi.com/btd6/odyssey",
        "column": "OdysseyProps"
    }
}


class EventHandler(commands.Cog):

    def __init__(self, bot: discord.Bot):

        self.bot = bot 
        self.events = EventTable()
        self.schedueler = AsyncIOScheduler()
        self.schedueler.add_job(self.checkForNewEvent, "cron", minute=0)
     
    async def postLoad(self):
    
        if not self.schedueler.running:
            self.schedueler.start()
        

    async def checkForNewEvent(self):
        print("hello, a new hour has begun") 


def setup(bot: discord.Bot):
    bot.add_cog(EventHandler(bot))
