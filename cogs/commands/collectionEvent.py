import discord 
from discord.ext import commands 
from api.client import client
from profile.collectionEventProfile import collectionEventProfile
from utils.dataclasses import Events, URLS
from utils.helperFunctions import getCurrentTimeStamp

class CollectionEvent(commands.Cog):

    def __init__(self, bot: discord.Bot):

        self.bot = bot 

    @discord.slash_command(
        name = "collection_event", 
        description = "Show the Collection Event Cycle", 
        integration_types = {
            discord.IntegrationType.user_install,
            discord.IntegrationType.guild_install
        }
    )
    @commands.cooldown(1, 5, commands.BucketType.user)
    async def execute(self, ctx: discord.ApplicationContext) -> None:
                
        await ctx.response.defer()
        currentTimeStamp = getCurrentTimeStamp()

        eventData: Events = await client.fetch(url = URLS["Events"].base)
        currentEvent = next(
            event for event in eventData.body
            if event.type == "collectableEvent"
            and currentTimeStamp < event.end
        )
        
        eventDetails = processCollectionEvent(currentEvent)    
