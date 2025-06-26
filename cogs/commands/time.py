import discord 
from discord.ext import commands 

class Time(commands.Cog):
    def __init__(self, bot: discord.Bot):
        self.bot = bot

    time = discord.SlashCommandGroup("time", "", integration_types = {discord.IntegrationType.user_install,
                                                discord.IntegrationType.guild_install})
    
    @time.command(name="send", description="calculate the time you have to full send", 
                  integration_types = {discord.IntegrationType.guild_install, 
                                       discord.IntegrationType.user_install})
    @commands.cooldown(1, 5, commands.BucketType.user)
    @discord.option(
        "start_round",
        description = "choose the round you're starting on", 
        required = True
        )
    @discord.option(
        "end_round",
        description = "choose the round you're sending to",
        required = True 
        )
    @discord.option(
        "time",
        description = "enter the time you're sending on in mm:ss:ms, for example: 00:45.00",
        required = True 
        )
    async def send(self, ctx: discord.InteractionContextType, start_round: int, end_round: int, time: str) -> None:
        print(start_round, end_round, time)

def setup(bot: discord.Bot):
    bot.add_cog(Time(bot))

