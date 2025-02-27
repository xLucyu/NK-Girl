import discord 
from discord.ext import commands
from cogs.profile.tileProfile import tileProfile
from cogs.eventNumber import getCurrentCTEvent
from utils.discord.viewmenu import SelectView

class Tile(commands.Cog):

    def __init__(self, bot):
        
        self.bot = bot 
 
    @discord.slash_command(name="tile", description="Get CT Tile Data", 
                           integration_types={discord.IntegrationType.user_install,
                                              discord.IntegrationType.guild_install})
    @commands.cooldown(1, 5, commands.BucketType.user) 
    @discord.option("tile_code", description = "The 3 letter Tile code.", required = True)
    @discord.option("event", description = "CT Week, default will be the latest week.", required = False)
    async def tile(self, ctx: discord.ApplicationContext, tile_code: str, event: int = 0):
        
        if event == 0:
            eventIndex = getCurrentCTEvent()
        else:
            eventIndex = event

        embed, categorizedTiles = tileProfile(eventIndex, tile_code) #type: ignore
        
        data = {
            "Author": ctx.author.id,
            "EventName": ["Banner", "Relic"],
            "PreviousEvents": categorizedTiles,
            "Function": tileProfile,
            "Difficulty": tile_code,
            "Message": None,
            "Emoji": ["<:Banner:1338202859854102539>", "<:Relic:1338923236263723079>"]
        }

        view = SelectView(data)
        message = await ctx.respond(embed=embed, view=view)
        view.message = message
    
def setup(bot):
    bot.add_cog(Tile(bot)) 
