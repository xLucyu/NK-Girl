import discord 
from components.selectMenu import SelectMenu
from components.buttonMenu import ButtonMenu
from utils.dataclasses import ViewContext, viewContext

USEBUTTON = ["Boss", "Odyssey", "Coop Mode", None]

class SelectView(discord.ui.View):

    def __init__(self, viewContext: ViewContext):

        super().__init__(timeout=180)
        self._viewContext = viewContext 
        self._buildView()

    def _buildView(self):

        if self._viewContext.tiles:
            ... 

        if self._viewContext.eventName in USEBUTTON:
            
            for layout in self._viewContext.buttonLayout:
                self.add_item(ButtonMenu(self._viewContext, layout))

        if self._viewContext.eventName is not None:
            ...
     

    async def on_timeout(self):
        
        if self.message:

            await self.message.edit(view=None)
            self.index = None
            self.difficulty = None 
