import discord 
from discord.ext import commands
from api.fetchId import getData
from cogs.profile.tileProfile import tileProfile
from cogs.eventNumber import getCurrentCTEvent
from utils.discord.viewMenu import SelectView  

class Tile(commands.Cog):
    def __init__(self, bot):
        self.bot = bot 

    @discord.message_command(name="Tile Lookup", description="If this message has a tile code for CT, you can look it up.",
                             integration_types={discord.IntegrationType.user_install,
                                             discord.IntegrationType.guild_install}) 
    async def getTileCode(self, ctx: discord.ApplicationContext, message: discord.Message):
         
        eventIndex = getCurrentCTEvent()
        url = f"https://storage.googleapis.com/btd6-ct-map/events/{eventIndex}/tiles.json"
        ctInfo = getData(url)
        
        tileCode = ""
        validTiles = [word for word in message.content.split() if len(word) == 3]
        allCtTiles = [tile for tile in ctInfo]

        for word in validTiles:
            if word.upper() in allCtTiles:
                tileCode = word
                break 

        if not eventIndex:
            eventIndex = 0

        await self.tile(ctx, tile_code=tileCode, event=eventIndex) 
 
    @discord.slash_command(name="tile", description="Get CT Tile Data", 
                           integration_types={discord.IntegrationType.user_install,
                                              discord.IntegrationType.guild_install}) 
    @commands.cooldown(1, 5, commands.BucketType.user) 
    @discord.option(
        "tile_code", 
        description = "The 3 letter Tile code.", 
        required = True
        )
    @discord.option(
        "event",
        description = "CT Week, default will be the latest week.", 
        required = False
        )
    async def tile(self, ctx: discord.ApplicationContext, tile_code: str, event: int = 0) -> None: 
        await ctx.response.defer()

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
