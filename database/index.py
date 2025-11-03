import psycopg2
from config import HOST, PORT, DATABASE, USER, PASSWORD 


class DataBaseConnection:

    def __init__(self) -> None:

        self.connector = None 
        self.cursor = None 
        self.connected = False 

    def connectToPostgre(self) -> None:
        
        if not self.connected:
            try:

                self.connector = psycopg2.connect(
                    host = HOST, 
                    port = PORT,
                    dbname = DATABASE,
                    user = USER,
                    password = PASSWORD 
                )

                self.cursor = self.connector.cursor()
                print("Database connected")
                self.connected = True 

            except Exception as e:
                print("failed to load connection", e)

    def getCursor(self) -> psycopg2.extensions.cursor:
        
        if not self.connected:
            self.connectToPostgre()

        return self.cursor

    def getConnector(self) -> psycopg2.extensions.connection:

        if not self.connected:
            self.connectToPostgre()

        return self.connector 
