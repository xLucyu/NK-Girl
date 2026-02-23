import discord
from discord.ext import commands
from dataclasses import dataclass
#from apscheduler.schedulers.asyncio import AsyncIOScheduler
from api import client, EventContext
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

@dataclass(frozen=True)
class EventCheck:
    Difficulties: list[str | None]
    Function: callable
    Type: EventType

EVENTS_TO_CHECK = {
    "Race": EventCheck(
        Difficulties = [None],
        Function = raceProfile,
        Type = EventType.Race
    ),
    "Boss": EventCheck(
        Difficulties = ["Standard", "Elite"],
        Function = bossProfile,
        Type = EventType.Boss
    ),
    "Odyssey": EventCheck(
        Difficulties = ["Easy", "Medium", "Hard"],
        Function = odysseyProfile,
        Type = EventType.Odyssey
    ),
    "CollectionEvent": EventCheck(
        Difficulties = [None],
        Function = collectionEventProfile,
        Type = EventType.Collection
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
            "CollectionEvent": ""
        }

    async def postLoad(self):
        
        await self.bot.wait_until_ready() 
    
        #cogs need to be loaded first 
        if not self.scheduler.running:
            self.scheduler.start() 

        await self.checkForNewEvent()

    
    def getCurrentEventCache(self, eventName: str) -> int:
        return self.currentEventCache.get(eventName)

        
    def _saveEventCache(self, eventName: str, id: str) -> None:
        self.currentEventCache[eventName] = id  

    
    def getRegisteredChannels(self, event: str, guildID: str = None) -> list[str] | str | None:
         
        channels = self.database.fetchAllRegisteredChannels(event)
        
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
        timeStamp: int,
        seenEvents: list[str],
        eventType: EventType,
        isManual: bool
    ) -> EventBody | None:

        nextEvent = getCurrentActiveEvent(mainData, timeStamp, eventType)

        if not nextEvent:
            return

        if isManual or nextEvent.id not in seenEvents:
            return nextEvent

        return


    async def buildEventEmbeds(
            self,
            eventName: str,
            mainData: Events,
            guildID: str,
            eventType: str,
            timeStamp: int,
            isManual: bool = False
    ) -> list[discord.Embed] | None:
        
        params = EVENTS_TO_CHECK[eventName]

        eventType = params.Type.value
        eventFunction = params.Function
        difficulties = params.Difficulties

        seenEvents = [] if isManual else self.database.fetchEventIds(eventType, guildID)

        validEvent = self.getValidEvent(
            mainData,
            timeStamp,
            seenEvents,
            eventType,
            isManual
        )

        embeds = []

        for difficulty in difficulties:
            difficulty = difficulty.lower() if difficulty else None

            result = eventFunction(validEvent.id, difficulty)
            embed = result.get("Embed")

            if embed:
                embeds.append(embed)

        if validEvent.id not in seenEvents:
            self.database.appendEvent(validEvent.id, eventName, guildID)

        self._saveEventCache(eventName, validEvent.id)

        contextBuilder = EventContext(
                urls=URLS[eventName],
                id=validEvent.id,
                difficulty=difficulty,
                isLeaderboard = False
            )
        
        profileContext = await contextBuilder.buildEventContext()
        embeds.append(eventFunction(profileContext))

        return embeds
        
    async def checkForNewEvent(self):

        currentTimeStamp = getCurrentTimeStamp()
        rawData = await client.fetch(URLS["Events"].base)
        mainData = transformDataToDataClass(Events, rawData)

        for eventName in EVENTS_TO_CHECK:

            channels = self.getRegisteredChannels(eventName)

            if not channels:
                continue
            
            for channelId in channels:

                try:
                    channel = await self.bot.fetch_channel(int(channelId))

                    if not channel:
                        continue

                    guildID = str(channel.guild.id)

                    embeds = await self.buildEventEmbeds(
                        eventName=eventName,
                        mainData=mainData,
                        guildID=guildID,
                        currentTimeStamp=currentTimeStamp
                    )

                    message = await channel.send(embeds=embeds)

                    if channel.type == discord.ChannelType.news:
                        await message.publish()

                except Exception:
                    continue
