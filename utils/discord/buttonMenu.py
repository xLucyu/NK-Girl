import discord

class ButtonMenu(discord.ui.Button):

    def __init__(self, **components): 

        self.parentView = components.get("View", None)
        self.boss = components.get("Boss", None)
        self.userID = components.get("UserID", None)
        self.function = components.get("Function", None)
        self.layout = components.get("Layout", None) 
         
        super().__init__(
            label=(self.layout[0]),
            custom_id=self.layout[1],
            style=getattr(discord.ButtonStyle, self.layout[2])
        )

    async def callback(self, interaction:discord.Interaction) -> None:
        
        if interaction.user.id != self.userID:
            await interaction.response.send_message("You are not the original user.", ephemeral=True)
            return 

        await interaction.response.defer()

        difficulty = self.custom_id 
        args = [self.parentView.index, difficulty.lower()]

        if self.boss:
            args.append(self.boss)

        eventDetails = self.function(*args)

        embed = eventDetails["Embed"]
        self.parentView.difficulty = difficulty.lower() 

        await interaction.edit_original_response(embed=embed)
        self.parentView.message = await interaction.original_response()
