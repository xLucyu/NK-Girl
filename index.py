import asyncio
import discord 
from config import BOTTOKEN
from database.index import DatabasePool
from database.logic.guilds import GuildTable 
from database.logic.usage import UsageTable 
from api import client

from cogs.commands import * 
from utils.logging import *

class DiscordBotClient(discord.Bot):

    def __init__(self):

        super().__init__(intents=discord.Intents.all())
        pool = DatabasePool()

        self.guildTable = GuildTable(pool)
        self.usageTable = UsageTable(pool)

    async def on_ready(self): 
        
        for guild in self.guilds:
            print(guild)

    def load_cogs(self) -> None:

        cogs = [
            Admin(self, self.usageTable),
            Boss(self),
            BossDetails(self),
            Challenge(self),
            Channel(self, self.guildTable),
            Event(self, self.guildTable),
            Feedback(self, self.usageTable),
            Help(self),
            Leaderboard(self),
            Odyssey(self),
            Race(self),
            Tile(self),
            Time(self),
            ErrorHandler(self),
            EventManager(self, self.guildTable),
            CommandLogger(self, self.usageTable)
        ] 

        for cog in cogs:
            self.add_cog(cog)

        print("loaded cogs")


    async def loadEventManager(self) -> None:

        scheduler: EventManager = self.get_cog("EventManager")
        if scheduler:
            await scheduler.postLoad()
            print("EventManager running")

    async def startApiSession(self) -> None:

        await client.start()
        print("started api session")
    
    async def on_disconnect(self) -> None:

        await client.stop()
        print("stopped api session")

if __name__ =="__main__":

    bot = DiscordBotClient()
    bot.load_cogs()
    bot.loop.create_task(bot.loadEventManager())
    bot.loop.create_task(bot.startApiSession())
    bot.run(BOTTOKEN)
