import discord
from datetime import datetime 
from config import BOTTOKEN
from database.index import DatabasePool
from database.logic.guilds import GuildTable 
from database.logic.usage import UsageTable 
from api import wrapper
from cogs.commands import * 
from utils.listeners import *
from utils.eventManager.cache.eventCache import EventManager

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
            CommandLogger(self, self.usageTable)
        ] 

        for cog in cogs:
            self.add_cog(cog)

        print("loaded cogs")


    async def loadEventManager(self, eventManager: EventManager) -> None:
        
        await eventManager.checkForNewEvent()
        print("started building event cache")
        await eventManager.startScheduler()
        print(f"started event scheduler at: {datetime.now()}")

    async def startApiSession(self) -> None:

        await wrapper.start()
        print("started api session")
    
    async def close(self) -> None:

        await wrapper.stop()
        print("stopped api session")

if __name__ =="__main__":

    bot = DiscordBotClient()
    eventManager = EventManager()
    bot.loadCogs()
    bot.loop.create_task(bot.startApiSession())
    bot.loop.create_task(bot.loadEventManager(eventManager))
    bot.run(BOTTOKEN)


