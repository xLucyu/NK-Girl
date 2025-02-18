import discord 
from discord.ext import commands
from config import GUILDID
from cogs.profile.bossdetailsProfile import bossdetailsProfile
from utils.discord.viewmenu import SelectView


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
            difficulty = "Standard"

        embed, modes = bossdetailsProfile(players-1, difficulty.lower()) # type: ignore

        data = {
            "Author": ctx.author.id, 
            "EventName": ["Coop Mode"],
            "PreviousEvents": [modes],
            "Function": bossdetailsProfile,
            "Difficulty": difficulty.lower(),
            "Message": None,
            "Emoji": ["<:Coop:1341515962410598521>"], 
            "Button": [
                    ["Normal", "standard", "success"],
                    ["Elite", "elite", "danger"]
                ]
            }

         
        view = SelectView(data)
        message = await ctx.respond(embed=embed, view=view)
        view.message = message   

        

def setup(bot):
    bot.add_cog(BossDetails(bot))


