from config import BOTTOKEN
import discord 
from database.index import DatabasePool
from database.logic.guilds import GuildTable 
from database.logic.usage import UsageTable 
from api.clientSession import clientSession


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

    async def setup_hook(self) -> None:

        self.load_cogs()
        await self.loadEventManager()


    def load_cogs(self) -> None:

        cogs = [
            Admin(bot, self.usageTable),
            Boss(bot),
            BossDetails(bot),
            Challenge(bot),
            Channel(bot, self.guildTable),
            Event(bot, self.guildTable),
            Feedback(bot, self.usageTable),
            Help(bot),
            Leaderboard(bot),
            Odyssey(bot),
            Race(bot),
            Tile(bot),
            Time(bot),
            ErrorHandler(bot),
            EventManager(bot, self.guildTable),
            CommandLogger(bot, self.usageTable)
        ] 

        for cog in cogs:
            bot.add_cog(cog)

        print("loaded cogs")


    async def loadEventManager(self) -> None:

        scheduler: EventManager = self.get_cog("EventManager")
        if scheduler:
            await scheduler.postLoad()
            print("EventManager running")

if __name__ =="__main__":
    bot = DiscordBotClient() 
    bot.run(BOTTOKEN)

