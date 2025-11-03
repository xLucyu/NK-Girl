from config import BOTTOKEN
import discord, os 
from database.index import DataBaseConnection


class DiscordBotClient(discord.Bot):

    def __init__(self):

        super().__init__(intents=discord.Intents.all())
        self.database = DataBaseConnection()

    async def on_ready(self): 

        for guild in self.guilds:
            print(guild)


    def load_cogs(self) -> None:
        # loads all cogs in commands folder
        for file in os.listdir('./cogs/commands/'):
            if file.endswith(".py"):
                self.load_extension(f"cogs.commands.{file[:-3]}") 

        self.load_extension("utils.logging.errorHandler")
        self.load_extension("utils.logging.logger")
     #   self.load_extension("utils.logging.eventHandler") 

    def initializeDatabase(self):
        
        self.database.connectToPostgre() 

if __name__ =="__main__":
    bot = DiscordBotClient() 
    bot.load_cogs() 
    bot.initializeDatabase()
    bot.run(BOTTOKEN)
