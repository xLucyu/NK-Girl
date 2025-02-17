import discord 
from discord.ext import commands
from config import GUILDID
from cogs.profile.bossdetailsProfile import bossdetailsProfile


class BossDetails(commands.Cog):
    def __init__(self, bot):

        self.bot = bot

    @discord.slash_command(name="bossdetails", description="Show details about the current Boss.",
                           guild=discord.Object(id=int(GUILDID))) #type: ignore
    @discord.option(
        "difficulty",
        description = "Choose a difficulty, default is Normal.",
        choices = ["Normal", "Elite"],
        required = False
    )
    @discord.option(
        "players",
        description = "Choose the mode, default is solo",
        choices = [1, 2, 3, 4],
        required = False
    )
    
    async def bossdetails(self, ctx: discord.ApplicationContext,
                          difficulty: str = "Normal",
                          players: int = 1):

        if difficulty == "Normal":
            difficulty = "standard"

        embed, bannerURL = bossdetailsProfile(difficulty.lower(), players) # type: ignore
        embed.set_footer(text="*Dreadbloon and Phayze have their Shield Health included.")
        embed.set_image(url=bannerURL)
        await ctx.respond(embed=embed)

        

def setup(bot):
    bot.add_cog(BossDetails(bot))


