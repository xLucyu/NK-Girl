import discord 
from cogs.baseCommand import BaseCommand
from utils.dataclasses.leaderboard import Leaderboard

from typing import TYPE_CHECKING 
if TYPE_CHECKING:
    from leaderboards.pageButtons import ButtonView

class PageModal(discord.ui.Modal):

    def __init__(self, **components):

        title = components.get("Title", None)
        label = components.get("Label", None)
        placeholder = components.get("Placeholder", None)
        self.buttonView: ButtonView = components.get("View", None)
        self.filter = components.get("Filter", None)
        self.url = components.get("Url", None)
        self.lbType = components.get("LbType", None)

        super().__init__(title = title)

        self.add_item(
            discord.ui.InputText(
                label = label, 
                placeholder = placeholder, 
                style = discord.InputTextStyle.short,
                required = True
            )
        ) 

    async def callback(self, interaction:discord.Interaction): 
        
        match self.filter:

            case "pageNumber":
                page = await self.getPage(interaction)

            case "pagePlayer":
                pass

        if not page:
            return 
        
        await interaction.response.defer()
        self.buttonView.page = page
        self.buttonView.updateButtonState()
        await self.buttonView.updateLeaderboard(interaction)


    async def getPage(self, interaction: discord.Interaction) -> int | None:
 
        value = self.children[0].value
        
        try:
            page = int(value)

        except ValueError:
            await interaction.response.send_message("Please enter a number", ephemeral = True)
            return 
            
        maxPage = 20 if self.lbType == "Race" else 40

        print(self.lbType, maxPage)

        if not 1 <= page <= maxPage:
            await interaction.response.send_message(f"Page must be between 1 and {maxPage}", ephemeral = True)
            return

        return page 

