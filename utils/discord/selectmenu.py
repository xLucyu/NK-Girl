import discord

class SelectMenu(discord.ui.Select):

    def __init__(self, *components):

        self.parentView = components[0]  
        self.eventName = components[1] 
        self.difficulty = components[2]
        self.userID = components[3]
        self.function = components[4]
        self.emoji = components[5]
        self.eventNames = components[6] 
        
        options = [
            discord.SelectOption(label=str(name), value=str(eventindex), emoji=self.emoji)
            for eventindex, name in enumerate(self.eventNames[:24])  # Keep first 24 events
        ]

        super().__init__(
            placeholder=f"Please select a {self.eventName}",
            options=options,
            disabled=False
        )
        
    async def callback(self, interaction:discord.Interaction):
        
        userID = interaction.user.id #type: ignore

        if userID != self.userID:
            await interaction.response.send_message("You are not the original User", ephemeral=True)
            return 

        try:
            data = self.parentView.index.get(userID, None)
            selectedIndex = int(self.values[0]) #type: ignore

            if data is None:
                data = self.parentView.index[userID] = dict()

            data["EventIndex"] = selectedIndex
            difficulty = data.get("Difficulty", None)
        
            if difficulty is None:
                data["Difficulty"] = self.difficulty

            if type(self.eventNames[-1]) == int:
                embed, _ = self.function(self.eventNames[-1], self.eventNames[selectedIndex])
            else:
                embed, _ = self.function(selectedIndex, difficulty)
                await interaction.response.edit_message(embed=embed)

        except:
            await interaction.response.send_message(content="Something went wrong, please try again.", ephemeral=True)
