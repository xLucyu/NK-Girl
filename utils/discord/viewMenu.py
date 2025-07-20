import discord 
from utils.discord.selectMenu import SelectMenu
from utils.discord.buttonMenu import ButtonMenu

useButton = ["Boss", "Odyssey", "Coop Mode", None]

class SelectView(discord.ui.View):
    def __init__(self, data: dict):
        super().__init__(timeout=180)
        self.message = data.get("message", None)
        self.userID = data.get("Author", None)
        self.event = data.get("EventName", None)
        self.eventNames = data.get("PreviousEvents", None)
        self.emoji = data.get("Emoji", None)
        self.difficulty = data.get("Difficulty", None) 
        self.buttonLayout = data.get("Button", None)
        self.function = data.get("Function", None)
        self.boss = data.get("Boss", None)
        self.tiles = data.get("Tiles", None)
        self.ctEventIndex = data.get("CTEventIndex", None)
        self.index = dict() #safe current index for button and select menu 
        self.handleViewMenus()
    
    def handleViewMenus(self): 
        if self.tiles: 
            for category in range(len(self.tiles)): 
                selectMenuView = SelectMenu(
                    View = self,
                    Event = self.event[category],
                    Difficulty = self.difficulty,
                    UserID = self.userID,
                    Function = self.function, 
                    Tiles = self.tiles[category],
                    CTEventIndex = self.ctEventIndex
                )
                self.add_item(selectMenuView)
        else: 
            if self.event in useButton: 
                self.addButtonMenu()
            if self.event is not None: 
                self.addSelectMenu()
 
    def addSelectMenu(self):  
        selectMenuView = SelectMenu(
                View = self,
                Event = self.event,
                Difficulty = self.difficulty,
                UserID = self.userID,
                Function = self.function,
                Emoji = self.emoji,
                Boss = self.boss, 
                EventNames = self.eventNames 
            )

        self.add_item(selectMenuView)

    def addButtonMenu(self):
        for layout in self.buttonLayout:
            selectButtonView = ButtonMenu(
                View = self,
                Boss = self.boss,
                UserID = self.userID,
                Function = self.function, 
                Layout = layout 
            )
            self.add_item(selectButtonView)

    async def on_timeout(self):
        
        if self.message:
            try:
                await self.message.edit(view=None)
                self.index.clear()
            except discord.NotFound:
                pass
