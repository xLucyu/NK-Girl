import discord

class ButtonMenu(discord.ui.Button):

    def __init__(self, *components):
        
        self.parentView = components[0]
        self.userID = components[1]
        self.function = components[2]
        
        super().__init__(
            label=components[3][0],
            custom_id=components[3][1],
            style=getattr(discord.ButtonStyle, components[3][2])
        )

    async def callback(self, interaction:discord.Interaction):
        
        userID = interaction.user.id #type: ignore

        if userID != self.userID:
            await interaction.response.send_message("You are not the original user of this command.", ephemeral=True)
            return

        try:
            difficulty = self.custom_id
            data = self.parentView.index.get(userID, None)
            
            if data is None:
                data = self.parentView.index[userID] = dict()

            data["Difficulty"] = difficulty
            selectedIndex = data.get("EventIndex", 0)
            embed, _ = self.function(selectedIndex, difficulty)
            await interaction.response.edit_message(embed=embed)

        except:
            await interaction.response.send_message(content="Something went wrong, please try again.", ephemeral=True)

        
