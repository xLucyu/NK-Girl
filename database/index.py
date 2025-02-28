import sqlite3

class CommandTable:

    def __init__(self, command):

        self.connector = sqlite3.connect("database/commands.db")
        self.cursor = self.connector.cursor()
        self.command = command 
        
    def _createtable(self):

        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS COMMANDS (
            command TEXT PRIMARY KEY,
            uses INTEGER DEFAULT 0
            )
        """) 
        self.increaseCommandUsage()

    def increaseCommandUsage(self):
        
        self.cursor.execute(
            """
            INSERT INTO COMMANDS (command, uses) VALUES (?, 1)
            ON CONFLICT(COMMAND) DO UPDATE SET uses = uses + 1
            """, (self.command,)
        )
        self.connector.commit()
    
    def fetchCommands(self):
        
        self.cursor.execute("SELECT * FROM COMMANDS ORDER BY uses DESC")
        return self.cursor.fetchall()

    def close(self):
        self.connector.close()


    def __del__(self):
        self.close()

