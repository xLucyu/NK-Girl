import discord
from discord.ext import commands
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from api.client import client
from cogs.profile import (
    raceProfile,
    bossProfile,
    odysseyProfile,
    collectionEventProfile
)
from database.logic.guilds import GuildTable
from utils.dataclasses import Events, URLS, EventBody 
from utils.helperFunctions import (
    getCurrentActiveEvent, 
    getCurrentTimeStamp, 
    transformDataToDataClass
)
from utils.enums import EventType 

eventstoCheck = {
    "Race": {
        "difficulties": [None],
        "function": raceProfile,
        "type": EventType.Race 
    },
    "Boss": {
        "difficulties": ["Standard", "Elite"],
        "function": bossProfile,
        "type": EventType.Boss 
    },
    "Odyssey": {
        "difficulties": ["Easy", "Medium", "Hard"],
        "function": odysseyProfile,
        "type": EventType.Odyssey
    },
    "CollectionEvent": {
        "difficulties": [None],
        "function": collectionEventProfile,
        "type": EventType.Collection
        
    }
}


class EventManager(commands.Cog):

    def __init__(self, bot: discord.Bot, guildTable: GuildTable):

        self.bot = bot 
        self.events = guildTable
        self.scheduler = AsyncIOScheduler()
        self.scheduler.add_job(self.checkForNewEvent, "cron", minute=0)

        self.currentEventCache: dict[str, str] = {
            "Race": "",
            "Boss": "",
            "Odyssey": "",
            "CollectionEvent": ""
        }

    async def postLoad(self):
        
        await self.bot.wait_until_ready() 
    
        #cogs need to be loaded first 
        if not self.scheduler.running:
            self.scheduler.start() 

        await self.checkForNewEvent()

    
    def getCurrentEventCacheIndex(self, eventName: str) -> int:

        return self.currentEventCache[eventName]

        
    def _saveEventCacheIndex(self, eventName: str, id: str) -> None:

        self.currentEventCache[eventName] = id  
        print(self.currentEventCache)

    
    def getRegisteredChannels(self, event: str, guildID: str = None) -> list[str] | str | None:
         
        channels = self.events.fetchAllRegisteredChannels(event)
        
        if not channels:
            return
        
        if guildID:

            for channel in channels:
                channelObject = self.bot.get_channel(int(channel))

                if not channelObject:
                    continue 
                
                return str(channelObject.id)
                
        return channels
    

    def getValidEvent(
            self,
            mainData: Events,
            currentTimeStamp: int,
            seenEvents: list,
            eventType: str, 
            isManual: bool
    ) -> EventBody | None:

        nextEvent = getCurrentActiveEvent(mainData, currentTimeStamp, eventType)
        print(nextEvent)

        if not nextEvent:
            return None 

        if isManual or nextEvent.id not in seenEvents:
            return nextEvent

        return None

    
    async def getEventEmbeds(
            self,
            guildID: str = "",
            eventType: str = "",
            timeStamp: int = 0,
            isManual: bool = False
    ) -> list[discord.Embed] | None:
        
        eventEmbeds = []

        params = eventstoCheck[eventType]

        eventsURL = URLS["Events"].base
        eventType = params["EventType"]
        eventFunction = params["function"]
        difficulties = params["difficulties"]

        seenEvents = [] if isManual else self.events.fetchEventIds(eventType, guildID)

        eventData = await client.fetch(eventsURL)
        mainData = transformDataToDataClass(Events, eventData)
        validEvent = self.getValidEvent(mainData, timeStamp, seenEvents, eventType, isManual)

        if not validEvent:
            return

        eventMetaData = validEvent

        self._saveEventCacheIndex()

        for difficulty in difficulties:

            if difficulty:
                difficulty = difficulty.lower()

            eventData = eventFunction(index, difficulty)
            eventEmbeds.append(eventData.get("Embed"))

        if eventMetaData.id not in seenEvents:
            self.events.appendEvent(eventMetaData.id, eventName, guildID)
         
        return eventEmbeds

        
    async def checkForNewEvent(self):

        currentTimeStamp = getCurrentTimeStamp()

        for eventName in eventstoCheck:

            registeredChannels = self.getRegisteredChannels(eventName)

            if not registeredChannels:
                continue

            for channel in registeredChannels:

                try:
                    channelObject = await self.bot.fetch_channel(int(channel))

                    if not channelObject:
                        continue

                    guildID = str(channelObject.guild.id)
                    eventEmbeds = self.getEventEmbeds(eventName=eventName, guildID=guildID, timeStamp=currentTimeStamp)

                    if not eventEmbeds:
                        continue

                    message = await channelObject.send(embeds=eventEmbeds)

                    if channelObject.type == discord.ChannelType.news:
                        await message.publish()

                except Exception:
                    continue
