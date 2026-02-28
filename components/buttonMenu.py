import discord
from utils.dataclasses import ViewContext, URLS 
from api.eventContext import EventContext


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

        # update difficulty in shared state
        self._viewContext.difficulty = self.custom_id

        # 1️⃣ fetch fresh data from API
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

        # 2️⃣ format with profile function
        if self._function:
            eventDetails = await self._function(context)
        else:
            raise RuntimeError("No formatting function assigned.")

        # 3️⃣ update message
        await interaction.edit_original_response(embed=eventDetails.embed)
        self._viewContext.message = await interaction.original_message()
