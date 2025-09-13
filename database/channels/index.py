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

    def __del__(self):
        self.connector.close()
