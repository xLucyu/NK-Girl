import discord 
from discord.ext import commands

class Help(commands.Cog):
    def __init__(self, bot):

        self.bot = bot

    @discord.slash_command(name="help", description="get an overview of this bot", 
                           integration_types={discord.IntegrationType.user_install,
                                              discord.IntegrationType.guild_install})
    async def help(self, ctx: discord.ApplicationContext):

        embed = discord.Embed(
            title = f"**{self.bot.user.name}'s Help Menu.**",
            description="This will give you an overview of this bots potential!",
            color=discord.Color.blue()
        ) 

        embed.add_field(
            name = "**Owners**",
            value = "xlucyu and spani333",
            inline = False
        )

        embed.add_field(
            name = "**Overview**",
            value = "This bot was created to centralize all BTD6 Events into one Bot with a few extras. It's made in Python and focuses on simplicity and flexibility.",
            inline = False
        ) 

        embed.add_field(
            name = "**Commands**",
            value = "We have a variety of commands for you just try them out by typing `/race` or `/boss`. This will display the current boss event as well as previous ones! This one also supports extra ones like the current daily challenge. Just type `/challenge daily`. Or if you're worried if you're first strike is enough to insta kill ? Just type /bossdetails and it will show you the exact hp of a boss.",
            inline = False
        )

        embed.add_field(
            name = "Leaderboards",
            value = "We offer Leaderboards for every gamemode aswell as Multiplayer Leaderboards for Bosses. Just type `leaderboard mode` and enter some credentials to get the current Leaderboard.",
            inline = False
        )

        embed.set_author(name=ctx.author.name, icon_url=ctx.author.avatar.url) #type: ignore 
        embed.set_thumbnail(url=self.bot.user.avatar)

        await ctx.respond(embed=embed)

def setup(bot):
    bot.add_cog(Help(bot))
