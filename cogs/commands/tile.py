import discord 
from discord.ext import commands
from cogs.profile.tileProfile import tileProfile, getCurrentCtNumber
from utils.discord.viewMenu import SelectView
from api.fetchId import getData

class Tile(commands.Cog):
    def __init__(self, bot):
        self.bot = bot        

    @discord.message_command(name="Tile Lookup", description="If this message has a tile code for CT, you can look it up.",
                             integration_types={discord.IntegrationType.user_install,
                                             discord.IntegrationType.guild_install}) 
    async def getTileCode(self, ctx: discord.ApplicationContext, message: discord.Message):
         
        eventIndex = getCurrentCtNumber()
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
            eventIndex = getCurrentCtNumber()
        else:
            eventIndex = event

        embed, categorizedTiles = tileProfile(eventIndex, tile_code)

        banners = categorizedTiles[0]
        relics = categorizedTiles[1]

        categorizedBanners = [banner[0] for banner in banners]
        categorizedRelics = [relic[0] for relic in relics]

        bannerEmotes = [banner[1] for banner in banners]
        relicEmotes = [relic[1] for relic in relics]
        
        data = {
            "Author": ctx.author.id,
            "EventName": ["Banner", "Relic"],
            "PreviousEvents": categorizedBanners + categorizedRelics,
            "Function": tileProfile,
            "Difficulty": tile_code,
            "Message": None,
            "Emoji": bannerEmotes + relicEmotes
        }
        print(data)

        view = SelectView(data)
        message = await ctx.respond(embed=embed, view=view)
        view.message = message
    
def setup(bot):
    bot.add_cog(Tile(bot)) 
