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

        print(self.filter) 
