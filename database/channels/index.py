import sqlite3, json 

class EventTable:

    def __init__(self) -> None:
        
        self.connector = sqlite3.connect("database/channels/channels.db")
        self.cursor = self.connector.cursor()

    def createTable(self):

        self.cursor.execute(
            """
            create table if not exists GUILDS(
                GuildID text primary key, 
                RaceChannelID text, 
                BossChannelID text, 
                OdysseyChannelID text,
                RaceIDs text, 
                BossIDs text, 
                OdysseyIDs text
            )
            """
        )

    def appendChannelPerGuild(self, guildID: str, channelID: str, event: str) -> None:

        self.cursor.execute("insert or ignore into GUILDS (GuildID) values (?)", (guildID,))
        self.cursor.execute(f"update GUILDS set {event}ChannelID = ? where GuildID = ?", (channelID, guildID))

        self.connector.commit()


    def removeChannelFromGuild(self, guildID: str, event: str) -> str | None:
        
        self.cursor.execute(f" select {event}ChannelID from GUILDS where GuildID = ?", (guildID,))
        validRow = self.cursor.fetchone()
        oldChannelID = validRow[0] if validRow else None 

        self.cursor.execute(f"update GUILDS set {event}ChannelID = null where GuildID = ?", (guildID,))
        self.connector.commit()

        return oldChannelID


    def fetchAllRegisteredGuilds(self, event: str) -> list[str]:
        
        self.cursor.execute(f"select {event}ChannelID from GUILDS where {event}ChannelID is not null")
        validRows = self.cursor.fetchall()
        return [row[0] for row in validRows]


    def appendEvent(self, eventID: str, event: str, guildID: str) -> None:

        self.cursor.execute("insert or ignore into guilds (GuildID) values (?)", (guildID,))
        self.cursor.execute(f"select {event}IDs from GUILDS where GuildID = ?", (guildID,))

        validRow = self.cursor.fetchone()
        eventList = json.loads(validRow[0]) if validRow and validRow[0] else []

        if eventID not in eventList:
            eventList.append(eventID)
            self.cursor.execute(f"update GUILDS set {event}IDs = ? where GuildID = ?", (json.dumps(eventList), guildID))

        self.connector.commit()


    def fetchEventIds(self, event: str, guildID: str) -> list[str]:

        self.cursor.execute(f"SELECT {event}IDs FROM GUILDS WHERE GuildID = ?", (guildID,))
        row = self.cursor.fetchone()
        return json.loads(row[0]) if row and row[0] else []


    def __del__(self):
        self.connector.close()
