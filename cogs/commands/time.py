import discord 
from discord.ext import commands 

class Time(commands.Cog):
    def __init__(self, bot: discord.Bot):
        self.bot = bot

    time = discord.SlashCommandGroup("time", "", integration_types = {discord.IntegrationType.user_install,
                                                discord.IntegrationType.guild_install})
    
    @time.command(name="send", description="calculate the time you will get.", 
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
        pass 


    @time.command(name="ct", description="calculate the time to full send for the time you want to achieve")
    @discord.option(
        "goal_time",
        description = "choose the time you want to achieve", 
        required = True 
        )
    @discord.option(
        "current_time",
        description = "choose the time that's currently on the tile", 
        required = True 
        )
    @discord.option(
        "end_round", 
        description = "enter the end round of the ct tile",
        required = True 
        )
    async def ct(self, ctx: discord.InteractionContextType, goal_time: str, current_time: str, end_round: int):
        pass 


    @time.command(name="goal", description="calculate the time when you have to full send for your desired time")
    @discord.option(
        "goal_time",
        description = "choose the time you want to achieve",
        required = True 
        )
    @discord.option(
        "start_round",
        description = "choose the round you want to full send from",
        required = True 
        )
    @discord.option(
        "end_round",
        description = "choose the round you're trying to send to",
        required = True 
        )
    async def goal(self, ctx: discord.InteractionContextType, goal_time: str, start_round: int, end_round: int):
        pass
    
    

def setup(bot: discord.Bot):
    bot.add_cog(Time(bot))

