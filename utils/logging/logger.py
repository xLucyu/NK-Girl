import discord
from discord.ext import commands 
from database.index import CommandTable

class Logger(commands.Cog):
    def __init__(self, bot):
        self.bot = bot 

    @commands.Cog.listener()
    async def on_application_command(self, ctx: discord.ApplicationContext):
        commandName = str(ctx.command.name) 
        
        if commandName not in ["usage", "sync"]:
            commands = CommandTable()
            commands.increaseCommandUsage(commandName)  

def setup(bot):
    bot.add_cog(Logger(bot))
