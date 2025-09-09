import sqlite3, json 

class EventTable:

    def __init__(self) -> None:
        
        self.connector = sqlite3.connect("database/channels/channels.db")
        self.cursor = self.connector.cursor()

    def createTable(self):

        self.cursor.execute(
            """
                create table if not exists EVENTS(
                    GuildID TEXT PRIMARY KEY,
                    RaceProps TEXT CHECK (json_valid(RaceProps)),
                    BossProps TEXT CHECK (json_valid(BossProps)),
                    OdysseyProps TEXT CHECK (json_valid(OdysseyProps)),
                )
            """
        )
    
    def appendData(self, guildID: str, props: dict[str, str], column: str) -> None:

        self.cursor.execute(
            f"""
                insert into events (GuildID, {column}) values (?, ?)
                on conflict(GuildID) do update set {column} = exclude.{column}
            """, (guildID, json.dumps(props))
        )
        self.connector.commit() 

    def fetchData(self, guildID: str, column: str) -> dict:

        self.cursor.execute(f"select {column} from EVENTS where Guild = ?", (guildID,))
        self.connector.commit()

        return self.cursor.fetchone()

    def __del__(self):
        self.connector.close()
