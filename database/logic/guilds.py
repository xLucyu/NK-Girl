from database.index import DataBaseConnection


class GuildTable(DataBaseConnection):

    def __init__(self):

        super().__init__()
        self.connector = self.getConnector()
        self.cursor = self.getCursor()


