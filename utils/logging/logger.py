import discord
from discord.ext import commands 
from database.logic.usage import UsageTable

class Logger(commands.Cog):
    def __init__(self, bot: discord.Bot):

        self.bot = bot 
        self.database = UsageTable()

    @commands.Cog.listener()
    async def on_application_command(self, ctx: discord.ApplicationContext):

        commandName = str(ctx.command.name) 
        
        if commandName not in ["usage", "sync"]:

            self.database.increaseCommandUsage(commandName)  

def setup(bot: discord.Bot):
    bot.add_cog(Logger(bot))
