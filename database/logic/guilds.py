from database.index import DataBaseConnection
import json 

class GuildTable(DataBaseConnection):

    def __init__(self):

        super().__init__()
        self.connector = self.getConnector()
        self.cursor = self.getCursor()

    def appendChannelPerGuild(self, guildID: str, channelID: str, event: str) -> None:

        self.cursor.execute("insert into guilds (guildid) values (%s) on conflict (guildid) do nothing", (guildID,))
        self.cursor.execute(f"update guilds set {event.lower()}channelid = %s where guildid = %s", (channelID, guildID))

        self.connector.commit()

    def removeChannelFromGuild(self, guildID: str, event: str) -> str | None:

        self.cursor.execute(f"select {event.lower()}channelid from guilds where guildid = %s", (guildID,))

        validRow = self.cursor.fetchone()
        oldChannelID = validRow[0] if validRow else None 

        if not oldChannelID:
            return

        self.cursor.execute(f"update guilds set {event.lower()}channelid = null where guildid = %s", (guildID,))
        self.connector.commit()
        
        return oldChannelID

    def fetchAllRegisteredChannels(self, event: str) -> list[str] | None:

        self.cursor.execute(f"select {event.lower()}channelid from guilds where {event.lower()}channelid is not null") 
        validRows = self.cursor.fetchall()
     
        if len(validRows) == 0:
            return [] 
         
        return [row[0] for row in validRows]

    def appendEvent(self, eventID: str, event: str, guildID: str) -> None:

        self.cursor.execute("insert into guilds (guildid) values (%s) on conflict (guildid) do nothing", (guildID,))
        self.cursor.execute(f"select {event.lower()}ids from guilds where guildid = %s", (guildID,))

        validRow = self.cursor.fetchone()       
        eventList = json.loads(validRow[0]) if validRow and validRow[0] else []

        if eventID not in eventList:
            eventList.append(eventID)
            self.cursor.execute(f"update guilds set {event.lower()}ids = %s where guildid = %s", (json.dumps(eventList), guildID))
        
        self.connector.commit()

    def fetchEventIds(self, event: str, guildID: str) -> list[str]:

        self.cursor.execute(f"select {event.lower()}IDs from guilds where guildid = %s", (guildID,))

        validRow = self.cursor.fetchone()

        return json.loads(validRow[0]) if validRow and validRow[0] else []


