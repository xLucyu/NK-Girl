from discord import Bot, ApplicationContext  
from discord.ext import commands 
from database.logic.usage import UsageTable 

class CommandLogger(commands.Cog):

    def __init__(self, bot: Bot, usageTable: UsageTable):

        self.bot = bot 
        self.database = usageTable

    @commands.Cog.listener()
    async def on_application_command(self, ctx: ApplicationContext):

        commandName = str(ctx.command.name) 
        
        if commandName not in ["usage", "sync"]:
            self.database.increaseCommandUsage(commandName)  
