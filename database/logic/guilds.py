from json import loads, dumps
from database.index import DatabasePool

class GuildTable:

    def __init__(self, pool: DatabasePool):

        self.pool = pool
        

    def appendChannelPerGuild(self, guildID: str, channelID: str, event: str) -> None:

        with self.pool.connection() as cursor:

            cursor.execute("insert into guilds (guildid) values (%s) on conflict (guildid) do nothing", (guildID,))
            cursor.execute(f"update guilds set {event.lower()}channelid = %s where guildid = %s", (channelID, guildID))


    def removeChannelFromGuild(self, guildID: str, event: str) -> str | None:

        with self.pool.connection() as cursor:
            cursor.execute(f"select {event.lower()}channelid from guilds where guildid = %s", (guildID,))

            validRow = cursor.fetchone()
            oldChannelID = validRow[0] if validRow else None 

            if not oldChannelID:
                return

            cursor.execute(f"update guilds set {event.lower()}channelid = null where guildid = %s", (guildID,))
            
            return oldChannelID
            

    def fetchAllRegisteredChannels(self, event: str) -> list[str] | None:

        with self.pool.connection() as cursor:
            cursor.execute(f"select {event.lower()}channelid from guilds where {event.lower()}channelid is not null") 
            validRows = cursor.fetchall()
        
            if len(validRows) == 0:
                return [] 
            
            return [row[0] for row in validRows]
            

    def appendEvent(self, eventID: str, event: str, guildID: str) -> None:

        with self.pool.connection() as cursor:
            cursor.execute("insert into guilds (guildid) values (%s) on conflict (guildid) do nothing", (guildID,))
            cursor.execute(f"select {event.lower()}ids from guilds where guildid = %s", (guildID,))

            validRow = cursor.fetchone()       
            eventList = loads(validRow[0]) if validRow and validRow[0] else []

            if eventID not in eventList:
                eventList.append(eventID)
                cursor.execute(f"update guilds set {event.lower()}ids = %s where guildid = %s", (dumps(eventList), guildID))
            

    def fetchEventIds(self, event: str, guildID: str) -> list[str]:

        with self.pool.connection() as cursor:
            cursor.execute(f"select {event.lower()}IDs from guilds where guildid = %s", (guildID,))

            validRow = cursor.fetchone()
            return loads(validRow[0]) if validRow and validRow[0] else []


