from psycopg2.pool import SimpleConnectionPool
from psycopg2.extensions import cursor 
from config import HOST, PORT, DATABASE, USER, PASSWORD 


class DatabasePool:

    def __init__(self):

        self.pool = SimpleConnectionPool(
            minconn = 1, 
            maxconn = 5,
            user = USER,
            password = PASSWORD,
            host = HOST,
            port = PORT, 
            database = DATABASE
        )

    def connection(self):

        return PoolHelper(self)

    def close(self) -> None:

        self.pool.closeall()


class PoolHelper:

    def __init__(self, pool: DatabasePool):

        self.poolDB = pool 
        self.poolConnection = None 
        self.poolCursor = None 

    def __enter__(self) -> cursor:

        self.poolConnection = self.poolDB.pool.getconn()
        self.poolCursor = self.poolConnection.cursor()

        return self.poolCursor

    def __exit__(self, exc_type, exc_val, exc_tb):

        if self.poolCursor:
            self.poolCursor.close()

        if self.poolConnection:

            if not exc_type:
                self.poolConnection.commit()

            else:
                self.poolConnection.rollback()

            self.poolDB.pool.putconn(self.poolConnection)
