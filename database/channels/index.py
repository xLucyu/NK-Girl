import sqlite3, json 

class EventTable:

    def __init__(self) -> None:
        
        self.connector = sqlite3.connect("database/channels/channels.db")
        self.cursor = self.connector.cursor()

    def createTable(self):

        self.cursor.execute(
            """
            create table if not exists EVENTS(
                EventID text primary key,
                EventType text check(EventType in ("Race", "Boss", "Odyssey"))
            )
            """
        )

        self.cursor.execute(
            """
            create table if not exists GUILDS(
                GuildID text primary key, 
                RaceChannelID text, 
                BossChannelID text, 
                OdysseyChannelID text
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


    def fetchAllEventColumns(self, event: str) -> list[str]:
        
        self.cursor.execute(f"select {event}ChannelID from GUILDS where {event}ChannelID is not null")
        validRows = self.cursor.fetchall()
        return [row[0] for row in validRows]


    def __del__(self):
        self.connector.close()
