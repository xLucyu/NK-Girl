from database.index import DatabasePool

class UsageTable:

    def __init__(self, pool: DatabasePool):

        self.pool = pool

    def increaseCommandUsage(self, command: str) -> None:
        
        with self.pool.connection() as cursor:
            cursor.execute(
                """
                insert into usage (command, uses) values (%s, 1)
                on conflict(command) do update set uses = usage.uses + 1
                """, (command,)
            )
       
    
    def fetchCommands(self) -> list:
        
        with self.pool.connection() as cursor:
            
            cursor.execute("select * from usage order by uses desc")
            return cursor.fetchall()
