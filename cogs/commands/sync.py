import discord
from discord.ext import commands
from config import GUILDID


class Sync(commands.Cog):

    def __init__(self, bot):

        self.bot = bot

    @discord.slash_command(name="sync", description="Sync commands", guild=discord.Object(id=int(GUILDID))) #type: ignore
    @discord.option(
        "synctype",
        choices = ["guild", "global"],
        required = True 
    )
    async def sync(self, ctx: discord.ApplicationContext, synctype: str):
        
       
        if ctx.author.id != 1220815634515099718:
            await ctx.respond("You're not the owner")
        try:

            if synctype == "global": 
                await ctx.respond("commands are syncing globally.") 
                await self.bot.sync_commands()  
                print("commands are synced")
            else:
                await ctx.respond("commands are syncing for your server only.")
                await self.bot.sync_commands(guild_ids=[int(GUILDID)]) #type: ignore
                print("commands are synced")

        except Exception as e:
            print(f"Error: {e}")

    
def setup(bot):
    bot.add_cog(Sync(bot))
