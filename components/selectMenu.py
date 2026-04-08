import discord
from utils.dataclasses import ViewContext

class SelectMenu(discord.ui.Select):

    def __init__(self, viewContext: ViewContext): 
        
        self._viewContext = viewContext
        self._function = viewContext.function
        
        if self._viewContext.tiles:
            options = [
                discord.SelectOption(
                    label = str(tile[0]),
                    value = str(eventIndex),
                    emoji = tile[1]
                )
                for eventIndex, tile in enumerate(self._viewContext.tiles)
            ]

        else:
            options = [
                discord.SelectOption(
                    label = event.label,  
                    value = event.value, 
                    description = event.description,
                    emoji = self._viewContext.emoji
                )
                for event in self._viewContext.previousEvents
            ]
    
        super().__init__(
            placeholder = f"Please select a {self._viewContext.eventName}",
            options = options,
            disabled = False 
        )

    async def callback(self, interaction: discord.Interaction) -> None:

        await interaction.response.defer()

        if interaction.user.id != self._viewContext.userID:
            await interaction.followup.send(
                "You are not the original user.", 
                ephemeral=True
            )
            return

        self._viewContext.eventID = self.values[0]

        eventDetails = await updatedFunction(eventData)

        eventDetails = self._function(eventData)

        await interaction.edit_original_response(embed=eventDetails.embed)
        self._viewContext.message = await interaction.original_message()
