import discord 
from utils.dataclasses import ViewContext, URLS 
from functools import partial


class ButtonMenu(discord.ui.Button):

    def __init__(self, viewContext: ViewContext, layout: list):
        
        self._viewContext = viewContext
        self._function = viewContext.function  
        
        super().__init__(
            label=layout[0],
            custom_id=layout[1],
            style=getattr(discord.ButtonStyle, layout[2])
        )

    async def callback(self, interaction: discord.Interaction) -> None:

        await interaction.response.defer()

        if interaction.user.id != self._viewContext.userID:
            await interaction.followup.send(
                "You are not the original user.", ephemeral=True
            )
            return

        self._viewContext.difficulty = self.custom_id
      
 #       Details = await updatedFunction(context)

#            eventDetails = self._function(context)

        await interaction.edit_original_response(embed=eventDetails.embed)
        self._viewContext.message = await interaction.original_message()
