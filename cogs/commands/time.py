import discord 
from discord.ext import commands
from cogs.profile.timeProfile import timeProfile

class Time(commands.Cog):
    def __init__(self, bot: discord.Bot):

        self.bot = bot

    time = discord.SlashCommandGroup("time", "", integration_types = {discord.IntegrationType.user_install,
                                                                      discord.IntegrationType.guild_install})
    
    @time.command(name="send", description="calculate the time you will get")
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
        description = "enter the time you're sending in mm:ss.ms. Format examples: 45 | 1:25 | 45.25 | 01:25.45",
        required = True 
        )
    @discord.option(
        "abr"
    )
    async def send(self, ctx: discord.ApplicationContext, start_round: int, end_round: int, time: str, abr: bool = False) -> None:

        await ctx.response.defer()

        embed = timeProfile(
            CommandName = "send",
            StartRound = start_round,
            EndRound = end_round,
            Time = time,
            ABR = abr 
        )

        await ctx.respond(embed=embed)

    @time.command(name="goal", description="calculate the time when you have to full send for your desired time")
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
    @discord.option(
        "goal_time",
        description = "choose the time you want to achieve",
        required = True 
        )
    @discord.option(
        "abr"
    )
    async def goal(self, ctx: discord.ApplicationContext, start_round: int, end_round: int, goal_time: str, abr: bool = False):

        await ctx.response.defer()
        
        embed = timeProfile(
            CommandName = "goal",  
            StartRound = start_round,
            EndRound = end_round,
            GoalTime = goal_time,
            ABR = abr
        )

        await ctx.respond(embed=embed)

def setup(bot: discord.Bot):
    bot.add_cog(Time(bot))

