import discord 
from components.selectMenu import SelectMenu
from components.buttonMenu import ButtonMenu
from utils.dataclasses import ViewContext

class SelectView(discord.ui.View):

    def __init__(self, viewContext: ViewContext):

        super().__init__(timeout=180)
        self._viewContext = viewContext 
        self._buildView()

    def _buildView(self):

        if self._viewContext.buttonLayout:
            
            for layout in self._viewContext.buttonLayout:
                self.add_item(ButtonMenu(self._viewContext, layout))

        if self._viewContext.previousEvents:
            self.add_item(SelectMenu(self._viewContext))


    async def on_timeout(self):
        
        if self.message:

            await self.message.edit(view=None)
