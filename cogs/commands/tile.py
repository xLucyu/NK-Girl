import discord 
from discord.ext import commands
from cogs.profile.tileProfile import tileProfile, getCurrentCtNumber
from components.viewMenu import SelectView

class TileCog(commands.Cog):

    def __init__(self, bot: discord.Bot):

        self.bot = bot        

    @discord.message_command(
        name = "Tile Lookup",
        description = "If this message has a tile code for CT, you can look it up.",
        integration_types = {
            discord.IntegrationType.user_install,
            discord.IntegrationType.guild_install
        }
    ) 
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
 
    @discord.slash_command(
        name = "tile",
        description = "Get CT Tile Data", 
        integration_types = {
            discord.IntegrationType.user_install,
            discord.IntegrationType.guild_install
        }
    )
    @commands.cooldown(1, 5, commands.BucketType.user) 
    @discord.option(
        "tile_code", 
        description = "The 3 letter Tile code.", 
        required = True
        )
    @discord.option(
        "event",
        description = "CT Week, default will be the current week.", 
        required = False
        )
    async def tile(self, ctx: discord.ApplicationContext, tile_code: str, event: int = 0) -> None:

        await ctx.response.defer()
        eventIndex = getCurrentCtNumber() if event == 0 else event 

        embed, categorizedTiles = tileProfile(eventIndex, tile_code) 

        data = {
            "Author": ctx.author.id,
            "EventName": ["Banner", "Relic"],
            "Function": tileProfile,
            "Difficulty": tile_code,
            "Message": None,
            "CTEventIndex": eventIndex,
            "Tiles": categorizedTiles
        }

        view = SelectView(data)
        message = await ctx.respond(embed=embed, view=view)
        view.message = message 
