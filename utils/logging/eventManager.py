import discord
from typing import TypeVar, Type
from discord.ext import commands
from dataclasses import dataclass
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from api import client, EventContext
from cogs.profile import (
    raceProfile,
    bossProfile,
    odysseyProfile,
    collectionProfile
)
from database.logic.guilds import GuildTable
from utils.dataclasses import (
    Events,
    EventBody,
    MetaData,
    Odyssey,
    URLS 
)
from utils.helperFunctions import ( 
    getCurrentTimeStamp,
    transformDataToDataClass
)
from utils.enums import EventType 

T = TypeVar("T", MetaData, Odyssey, None)

@dataclass(frozen=True)
class EventCheck:
    Difficulties: list[str | None]
    Function: callable
    Type: EventType
    MetaDataObject: T

EVENTS_TO_CHECK = {
    "Race": EventCheck(
        Difficulties = [None],
        Function = raceProfile,
        Type = EventType.Race,
        MetaDataObject = MetaData

    ),
    "Boss": EventCheck(
        Difficulties = ["Standard", "Elite"],
        Function = bossProfile,
        Type = EventType.Boss,
        MetaDataObject = MetaData 
    ),
    "Odyssey": EventCheck(
        Difficulties = ["Easy", "Medium", "Hard"],
        Function = odysseyProfile,
        Type = EventType.Odyssey,
        MetaDataObject = Odyssey
    ),
    "CollectionEvent": EventCheck(
        Difficulties = [None],
        Function = collectionProfile,
        Type = EventType.Collection,
        MetaDataObject = None 
    ),
    "ContestedTerritory": EventCheck(
        Difficulties = [None],
        Function = None,
        Type = EventType.ContestedTerritory,
        MetaDataObject = None   
    )
}


class EventManager(commands.Cog):

    def __init__(self, bot: discord.Bot, guildTable: GuildTable):

        self.bot = bot 
        self.database = guildTable
        self.scheduler = AsyncIOScheduler()
        self.scheduler.add_job(self.checkForNewEvent, "cron", minute=0)

        self.currentEventCache: dict[str, str] = {
            "Race": "",
            "Boss": "",
            "Odyssey": "",
            "CollectionEvent": "",
            "ContestedTerritory": ""
        }

    async def postLoad(self):
        
        await self.bot.wait_until_ready() 
    
        #cogs need to be loaded first 
        if not self.scheduler.running:
            self.scheduler.start() 

        await self.checkForNewEvent(onStartup = True)

    
    def getCurrentEventCache(self, eventName: str) -> int:
        return self.currentEventCache.get(eventName)

        
    def _saveEventCache(self, eventName: str, id: str) -> None:
        self.currentEventCache[eventName] = id  


    def _getCurrentActiveEvent(
            self,
            mainData: Events,
            currentTimeStamp: int, 
            eventType: str
        )-> EventBody | None:
 
        try:
            return next(  
                event 
                for event in mainData.body 
                if event.end > currentTimeStamp and event.type == eventType
            )
        
        except ValueError:
            return


    async def buildEventEmbeds(
            self, 
            eventName: str,
            difficulties: list[str | None],
            eventID: str, 
            function: callable,
            metaDataObject: Type[T]
        ) -> list[discord.Embed]:

        if eventName is "ContestedTerritory":
            return []
        
        eventEmbeds = []

        if difficulties:

            for difficulty in difficulties:
                context = await EventContext(
                    urls = URLS[eventName],
                    id = eventID,
                    difficulty = difficulty,
                    isLeaderboard = False
                ).buildEventContext(metaDataObject)

                eventDetails = function(context)
                eventEmbeds.append(eventDetails["Embed"])

        return eventEmbeds
    
    
    async def _getUnannouncedChannels(self, eventName: str, event: EventBody) -> list[discord.TextChannel]:

        channels = self.database.fetchAllRegisteredChannels(eventName)

        if not channels:
            return 
        
        unnanouncedChannels = []
        for channelId in channels:

            channel = await self.bot.fetch_channel(int(channelId))

            if not channel:
                continue

            guildID = str(channel.guild.id)
            seenEvents = self.database.fetchEventIds(eventName, guildID)

            if event.id not in seenEvents:
                unnanouncedChannels.append(channelId)
        
        return unnanouncedChannels
    

    async def postAnnouncement(
            self,
            eventEmbeds: list[discord.Embed], 
            unanouncedChannels: list[discord.TextChannel]
        ) -> None:

        for channel in unanouncedChannels:

            message: discord.Message = await channel.send(embeds = eventEmbeds)

            if channel.type == discord.ChannelType.news:
                await message.publish()
            

    async def checkForNewEvent(self, onStartup: bool = False):

        currentTimeStamp = getCurrentTimeStamp()
        rawData = await client.fetch(URLS["Events"].base)
        mainData = transformDataToDataClass(Events, rawData)

        for eventName, eventChecks in EVENTS_TO_CHECK.items():

            validEvent = self._getCurrentActiveEvent(
                mainData,
                currentTimeStamp, 
                eventChecks.Type.value
            )

            if validEvent.id == self.currentEventCache.get(eventName):
                continue
            
            self._saveEventCache(eventName, validEvent.id)

            if onStartup:
                continue 
        
            unannouncedChannels = await self._getUnannouncedChannels(eventName, validEvent)
            eventEmbeds = await self.buildEventEmbeds(
                eventName,
                eventChecks.Difficulties,
                validEvent.id,
                eventChecks.Function,
                eventChecks.Type
            )
            await self.postAnnouncement(eventEmbeds, unannouncedChannels)
