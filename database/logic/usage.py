from database.index import DataBaseConnection


class UsageTable(DataBaseConnection):

    def __init__(self):

        super().__init__()
        self.connector = self.getConnector()
        self.cursor = self.getCursor()

    def increaseCommandUsage(self, command: str) -> None:
        
        self.cursor.execute(
            """
            insert into usage (command, uses) values (%s, 1)
            on conflict(command) do update set uses = usage.uses + 1
            """, (command,)
        )
        self.connector.commit()
    
    def fetchCommands(self) -> list:
        
        self.cursor.execute("select * from usage order by uses desc")
        return self.cursor.fetchall()
