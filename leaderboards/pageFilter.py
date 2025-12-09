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
        self.teamScores: dict = components.get("TeamScores", None)

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
                selectedPage = str(self.children[0].value)
                 
                if (
                    not selectedPage.isdigit()
                    or self.buttonView.lbType == "race" and not 1 <= int(selectedPage) <= 20
                    or not 1 <= int(selectedPage) <= 40
                ): 
                    await interaction.response.send_message("Please enter a valid page number.", ephemeral = True)
                    return

                await interaction.response.defer()
                self.buttonView.page = int(selectedPage)
                self.buttonView.checkButtons()
                await self.buttonView.callback(interaction, defered=False)
                return  

            case "pageSearch":
                await interaction.response.defer()
                selectedPlayerName = str(self.children[0].value)
                initialPage = 1

                if self.teamScores:
                    for (_, _), teamData in self.teamScores.items():
                        if selectedPlayerName in teamData:
                            selectedPage = initialPage // 25 + 1
                            
                            self.buttonView.page = int(selectedPage)
                            self.buttonView.checkButtons()
                            await self.buttonView.callback(interaction, defered=False) 
                            return
                    
                        initialPage += 1

                    await interaction.response.send_message("Player was not found", ephemeral = True)
                    return 


                while True: 
                    url = f"{self.url}?page={initialPage}"
                    leaderboardData = BaseCommand.useApiCall(url)
                    lbData = BaseCommand.transformDataToDataClass(Leaderboard, leaderboardData)
                    
                    if not lbData.success:
                        await interaction.response.send_message("Player was not found", ephemeral = True)
                        return 

                    lbBody = lbData.body 

                    for player in lbBody:
                        if selectedPlayerName == player.displayName: 
                            selectedPage = initialPage

                            self.buttonView.page = int(selectedPage)
                            self.buttonView.checkButtons()
                            await self.buttonView.callback(interaction, defered=False) 
                            return 

                    initialPage += 1
