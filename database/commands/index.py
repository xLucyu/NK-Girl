import sqlite3

class CommandTable:

    def __init__(self):

        self.connector = sqlite3.connect("database/commands.db")
        self.cursor = self.connector.cursor() 
        self._createtable()
        
    def _createtable(self):

        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS COMMANDS (
            command TEXT PRIMARY KEY,
            uses INTEGER DEFAULT 0
            )
        """)  

    def increaseCommandUsage(self, command):
        
        self.cursor.execute(
            """
            INSERT INTO COMMANDS (command, uses) VALUES (?, 1)
            ON CONFLICT(COMMAND) DO UPDATE SET uses = uses + 1
            """, (command,)
        )
        self.connector.commit()
    
    @staticmethod
    def fetchCommands(path = "database/commands.db"):
        
        with sqlite3.connect(path) as connector:
            cursor = connector.cursor()
            cursor.execute("select * from COMMANDS order by uses desc")
            return cursor.fetchall()

    def close(self):
        self.connector.close()

    def __del__(self):
        self.close()

