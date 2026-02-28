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

    def loadCogs(self) -> None:

        cogs = [
            AdminCog(self, self.usageTable),
            BossCog(self),
            BossDetailsCog(self),
            ChallengeCog(self),
            ChannelCog(self, self.guildTable),
            EventCog(self, self.guildTable),
            FeedbackCog(self, self.usageTable),
            HelpCog(self),
            LeaderboardCog(self),
            OdysseyCog(self),
            RaceCog(self),
            TileCog(self),
            TimeCog(self),
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
    
    async def close(self) -> None:

        await client.stop()
        print("stopped api session")

if __name__ =="__main__":

    bot = DiscordBotClient()
    bot.loadCogs()
    bot.loop.create_task(bot.loadEventManager())
    bot.loop.create_task(bot.startApiSession())
    bot.run(BOTTOKEN)


