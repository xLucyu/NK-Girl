import discord 
from utils.discord.buttonmenu import ButtonMenu
from utils.discord.selectmenu import SelectMenu

class SelectView(discord.ui.View):

    def __init__(self, data):

        super().__init__(timeout=90)
        self.message = data.get("message")
        self.userID = data.get("Author")
        self.events = data.get("EventName")
        self.eventNames = data.get("PreviousEvents")
        self.function = data.get("Function")
        self.difficulty = data.get("Difficulty")
        self.emoji = data.get("Emoji")
        self.buttonLayout = data.get("Button")
        self.viewmenu()
    

    def viewmenu(self):

        if type(self.eventNames[0][-1]) == int and type(self.eventNames[1][-1]) == int: #check for event number  
            for i in range(min(len(self.eventNames), len(self.emoji))):  
                self.add_item(SelectMenu(
                    self.userID,
                    self.events[i] if isinstance(self.events, list) else self.events,
                    self.eventNames[i],
                    self.function,
                    self.difficulty,
                    index=0,
                    emoji=self.emoji[i] if isinstance(self.emoji, list) else self.emoji
                ))
        else:

            if self.events in ["Boss", "Odyssey"]:
                self.addButtons() 

            self.add_item(SelectMenu(
                self.userID, 
                self.events, 
                self.eventNames, 
                self.function, 
                self.difficulty, 
                index=0, 
                emoji=self.emoji
                ))

    def addButtons(self):
        
        for layout in self.buttonLayout: 
            self.add_item(ButtonMenu(self.function, self.userID, layout[0], layout[1], layout[2]))


    async def on_timeout(self):
        
        self.clear_items()
        if not self.message:
            return
        await self.message.edit(view=self) 
