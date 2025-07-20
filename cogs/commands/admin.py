import discord
from discord.ext import commands
from database.index import CommandTable


class Admin(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

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
        try:

            if synctype == "global": 
                print("commands are syncing globally") 
                await self.bot.sync_commands()  
                await ctx.respond("commands are synced")
            else:
                print("commands are syncing for the guild only.")
                await self.bot.sync_commands(guild_ids=[1292232444363276310]) 
                await ctx.respond("commands are synced") 

        except Exception as e:
            print(f"Error: {e}")


    @discord.slash_command(name="usage", description="owner only") 
    async def usage(self, ctx: discord.ApplicationContext) -> None:
        if ctx.author.id != 1220815634515099718:
            await ctx.respond("You're not the owner")

        commandTable = CommandTable.fetchCommands()
        string = str()

        for command in commandTable:
            string += f"\nCommand: {command[0]}, Uses: {command[1]}"

        embed = discord.Embed(title="Command Usage Overview", description=f"```{string}```", color=discord.Color.blue())
        await ctx.respond(embed=embed) 
    
def setup(bot: discord.Bot):
    bot.add_cog(Admin(bot))
