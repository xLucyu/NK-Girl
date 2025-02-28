import discord
from discord.ext import commands 

class Logger(commands.Cog):
    def __init__(self, bot):
        self.bot = bot 

    @commands.Cog.listener()
    async def on_application_command(self, ctx: discord.ApplicationContext):

        print(ctx.command)


def setup(bot):
    bot.add_cog(Logger(bot))
