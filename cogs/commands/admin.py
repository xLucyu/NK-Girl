import discord
from discord.ext import commands
from database.logic.usage import UsageTable

class Admin(commands.Cog):

    def __init__(self, bot: discord.Bot, usageTable: UsageTable):
        
        self.bot = bot
        self.database = usageTable

    @discord.slash_command(name="sync", description="owner only")
    @discord.option(
        "synctype",
        choices = ["guild", "global"],
        required = True 
        )
    async def sync(self, ctx: discord.ApplicationContext, synctype: str) -> None:

        await ctx.response.defer()

        if ctx.author.id != 1220815634515099718:
            await ctx.respond("You're not the owner")
            return

        try:

            if synctype == "global": 
                await ctx.edit(content="syncing commands globally..") 
                await self.bot.sync_commands()  
                await ctx.edit(content="commands are synced!")

            else:
                await ctx.edit(content="syncing commands per guild..")
                await self.bot.sync_commands(guild_ids=[1292232444363276310]) 
                await ctx.edit(content="commands are synced") 

        except Exception as e:
            print(f"Error: {e}")

    @discord.slash_command(name="usage", description="owner only") 
    async def usage(self, ctx: discord.ApplicationContext) -> None:

        if ctx.author.id != 1220815634515099718:
            await ctx.respond("You're not the owner")
            return

        usageTable = self.database.fetchCommands()
        string = str()

        for command in usageTable:
            string += f"\nCommand: {command[0]}, uses: {command[1]}"

        embed = discord.Embed(title="Command Usage Overview", description=f"```{string}```", color=discord.Color.blue())
        await ctx.respond(embed=embed)  
