import discord
from discord.ext import commands 
from database.index import CommandTable

class Logger(commands.Cog):
    def __init__(self, bot):
        self.bot = bot 

    @commands.Cog.listener()
    async def on_application_command(self, ctx: discord.ApplicationContext):
        
        commandName = str(ctx.command.name) 
        self.commands = CommandTable(commandName)
        self.commands._createtable()
        commands = self.commands.fetchCommands()
        await ctx.respond(commands) 

def setup(bot):
    bot.add_cog(Logger(bot))
