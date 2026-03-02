import discord 
from dataclasses import replace
from utils.dataclasses import ViewContext, URLS 
from api.eventContext import EventContext
from functools import partial


class ButtonMenu(discord.ui.Button):

    def __init__(self, viewContext: ViewContext, layout: list):
        self._viewContext = viewContext
        self._function = viewContext.function  # formatting function
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
      
        context = await EventContext(
            urls=URLS[self._viewContext.eventName],
            id=self._viewContext.eventContext.id,
            isLeaderboard=False
        ).buildEventContext(
            difficulty=self._viewContext.difficulty,
            metaDataObject=self._viewContext.metaDataObject,
            subResourceObject=self._viewContext.subResourceObject,
            subURLResolver=self._viewContext.subURLResolver
        )

        if self._viewContext.boss:

            updatedFunction = partial(
                self._viewContext.function,
                players=self._viewContext.playerCount,
                boss=self._viewContext.boss,
                multiplier=self._viewContext.hpMultiplier
        )
            eventDetails = await currentFunction(context)

        else:
            eventDetails = self._function(context)

        await interaction.edit_original_response(embed=eventDetails.embed)
        self._viewContext.message = await interaction.original_message()
