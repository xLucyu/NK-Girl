import discord 
from components.selectMenu import SelectMenu
from components.buttonMenu import ButtonMenu

USEBUTTON = ["Boss", "Odyssey", "Coop Mode", None]

class SelectView(discord.ui.View):

    def __init__(self, data: dict):

        super().__init__(timeout=180)
        self.message = data.get("message", None)
        self.userID = data.get("Author", None)
        self.event = data.get("EventName", None)
        self.eventNames = data.get("PreviousEvents", None)
        self.emoji = data.get("Emoji", None)
        self.buttonLayout = data.get("Button", None)
        self.function = data.get("Function", None)
        self.tiles = data.get("Tiles", None)
        self.ctEventIndex = data.get("CTEventIndex", None)
        self.index = data.get("Index", 0) 
        self.difficulty = data.get("Difficulty", None) 
        self.boss = data.get("Boss", None)
        self.hpMultiplier = data.get("HpMultiplier", 0.0)
        self.playerCount = data.get("PlayerCount", 0)
        self._buildView()

    def _buildView(self):

        if self.tiles:
            self.addTilesSelect()

        if self.event in USEBUTTON:
            self.addButtonMenu()

        if self.event is not None:
            self.addSelectMenu()

    def addTilesSelect(self):
        
        for category in range(len(self.tiles)):
            
            self.add_item(
                SelectMenu(
                View = self,
                Event = self.event[category],
                Difficulty = self.difficulty,
                UserID = self.userID,
                Function = self.function,
                Tiles = self.tiles[category],
                CtEventIndex = self.ctEventIndex
                )
            )

    def addSelectMenu(self):
        
        self.add_item(
            SelectMenu(
                View = self,
                Event = self.event,
                Difficulty = self.difficulty,
                UserID = self.userID,
                Function = self.function,
                Emoji = self.emoji,
                Boss = self.boss,
                EventNames = self.eventNames
            )
        )

    def addButtonMenu(self):
        
        for layout in self.buttonLayout:

            self.add_item(
                ButtonMenu(
                    View = self,
                    Boss = self.boss,
                    UserID = self.userID,
                    Function = self.function,
                    Layout = layout
                )
            )

    async def on_timeout(self):
        
        if self.message:

            await self.message.edit(view=None)
            self.index = None
            self.difficulty = None 
