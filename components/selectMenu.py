import discord
from utils.dataclasses import ViewContext
from functools import partial

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

        eventData = self._viewContext.eventContext.buildEventContext(
            id = self._viewContext.eventID,
            difficulty = self._viewContext.difficulty,
            metaDataObject=self._viewContext.metaDataObject,
            subResourceObject=self._viewContext.subResourceObject,
            subURLResolver=self._viewContext.subURLResolver
        )

        if self._viewContext.boss:

            self._viewContext.playerCount = int(self.values[0])

            updatedFunction = partial(
                self._viewContext.function,
                players = self._viewContext.playerCount,
                boss = self._viewContext.boss,
                multiplier = self._viewContext.hpMultiplier
            )

            eventDetails = await updatedFunction(eventData)

        else:
            eventDetails = self._function(eventData)

        await interaction.edit_original_response(embed=eventDetails.embed)
        self._viewContext.message = await interaction.original_message()
