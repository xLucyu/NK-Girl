import discord 
from cogs.baseCommand import BaseCommand
from utils.dataclasses.leaderboard import Leaderboard
from utils.dataclasses.bossLB import BossLB

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
        
        await interaction.response.defer()

        match self.filter:

            case "pageNumber":
                page = await self._getPageRaw(interaction)

            case "pagePlayer":
                page = await self._getPageByPlayer(interaction)

            case _:
                page = None

        if not page:
            return 
        
        self.buttonView.page = page
        self.buttonView.updateButtonState()
        await self.buttonView.updateLeaderboard(interaction)


    async def _getPageRaw(self, interaction: discord.Interaction) -> int | None:
  
        try:
            page = int(self.children[0].value)

        except ValueError:
            await interaction.followup.send("Please enter a number", ephemeral = True)
            return 
            
        maxPage = 20 if self.lbType == "Race" else 40

        if not 1 <= page <= maxPage:
            await interaction.followup.send(f"Page must be between 1 and {maxPage}", ephemeral = True)
            return

        return page 
        
    
    async def _getPageByPlayer(self, interaction: discord.Interaction) -> int | None:

        value = str(self.children[0].value)
        position = None

        folMSG = await interaction.followup.send(f"Searching for player {value}...", ephemeral = True)

        if self.lbType == "Boss":
 
            data = BaseCommand.useApiCall(self.url)
            mainData = BaseCommand.transformDataToDataClass(BossLB, data)

            position = next(
                (team.position for team in mainData.teams
                for member in team.members 
                if member.displayName.lower() == value.lower()
                ), None 
            )
            
            if not position:
                await folMSG.edit(f"Player {value} wasn't found.")
                return 

            await folMSG.edit(f"{value} found at position {position}.")
            return position // 25 + 1


        else:

            initialPage = 1
            position = 1

            while True:

                data = BaseCommand.useApiCall(f"{self.url}?page={initialPage}")
                mainData = BaseCommand.transformDataToDataClass(Leaderboard, data)

                if not mainData.success or initialPage > 15:

                    await folMSG.edit(f"Player {value} wasn't found.")
                    return

                for player in mainData.body:
                    if player.displayName.lower() == value.lower():

                        await folMSG.edit(f"{value} found at position {position}.")
                        return initialPage

                    position += 1
                        
                initialPage += 1  
