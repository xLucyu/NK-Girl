import discord

from typing import TYPE_CHECKING 
if TYPE_CHECKING:
    from utils.discord.viewMenu import SelectView

class SelectMenu(discord.ui.Select):

    def __init__(self, **components): 

        self.parentView: SelectView = components.get("View", None)  
        self.eventName = components.get("Event", None) 
        self.difficulty = components.get("Difficulty", None) 
        self.userID = components.get("UserID", None) 
        self.function = components.get("Function", None) 
        self.emoji = components.get("Emoji", None) 
        self.eventNames = components.get("EventNames", None) 
        self.boss = components.get("Boss", None)
        self.tiles = components.get("Tiles", None)
        self.ctEventIndex = components.get("CTEventIndex", None)

        if self.tiles: #only for ct
            options = [
                discord.SelectOption(label=str(tile[0]), value=str(eventIndex), emoji=tile[1])
                for eventIndex, tile in enumerate(self.tiles)
            ]
        else:
            options = [
                discord.SelectOption(label=str(name), value=str(eventindex), emoji=self.emoji)
                for eventindex, name in enumerate(self.eventNames) 
            ]

        super().__init__(
            placeholder=f"Please select a {self.eventName}",
            options=options,
            disabled=False
        )
        
    async def callback(self, interaction:discord.Interaction) -> None:
        
        if interaction.user.id != self.userID:
            await interaction.response.send_message("You are not the original User of this command.", ephemeral=True)
            return 

        await interaction.response.defer()
            
        selectedIndex = int(self.values[0])
        args = [selectedIndex, self.parentView.difficulty]

        if self.parentView.playerCount:

            args[0] = self.parentView.index  
            args.append(selectedIndex)
            args.append(self.boss)
            args.append(self.parentView.hpMultiplier)
            self.parentView.playerCount = selectedIndex

        if self.tiles:

            args[0] = self.ctEventIndex
            args[1] = self.tiles[selectedIndex][0]
            
        eventDetails = self.function(*args)
        embed = eventDetails["Embed"]
        
        if not self.parentView.playerCount:
            self.parentView.index = selectedIndex

        await interaction.edit_original_response(embed=embed)
        self.parentView.message = await interaction.original_response()   
