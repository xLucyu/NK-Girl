import discord 
from utils.discord.selectMenu import SelectMenu
from utils.discord.buttonMenu import ButtonMenu

class SelectView(discord.ui.View):

    def __init__(self, data):
        super().__init__(timeout=180)
        self.message = data.get("message")
        self.userID = data.get("Author")
        self.event = data.get("EventName")
        self.eventNames = data.get("PreviousEvents")
        self.emoji = data.get("Emoji")
        self.difficulty = data.get("Difficulty") 
        self.buttonLayout = data.get("Button")
        self.function = data.get("Function") 
        self.index = dict() #safe current index for button and select menu 
        self.handleViewMenus()
    
    def handleViewMenus(self):
        if type(self.eventNames[0][-1]) == int and self.event[0] != "Coop Mode":
            for num in range(len(self.eventNames)):
                self.addSelectMenu(num)
        else: 
            if self.event[0] in ["Boss", "Odyssey", "Coop Mode", None]: 
                self.addButtonMenu()
            if self.event[0] is not None: 
                self.addSelectMenu(0)
 
    def addSelectMenu(self, num):
        selectMenuView = SelectMenu(
                View = self,
                Event = self.event[num],
                Difficulty = self.difficulty,
                UserID = self.userID,
                Function = self.function,
                Emoji = self.emoji[num],
                EventNames = self.eventNames[num]
            )

        self.add_item(selectMenuView)

    def addButtonMenu(self):
        for layout in self.buttonLayout:
            selectButtonView = ButtonMenu(
                View = self,
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
