import sqlite3

class CommandTable:

    def __init__(self):

        self.connector = sqlite3.connect("database/commands/commands.db")
        self.cursor = self.connector.cursor() 
        
    def createTable(self):

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
    
    def fetchCommands(self):
        
        self.cursor.execute("select * from COMMANDS order by uses desc")
        return self.cursor.fetchall()

    def __del__(self):
        self.connector.close()

