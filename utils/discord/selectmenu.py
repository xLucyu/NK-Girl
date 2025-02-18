import discord

class SelectMenu(discord.ui.Select):

    def __init__(self, **components):

        self.parentView = components.get("View", None)  
        self.eventName = components.get("Event", None) 
        self.difficulty = components.get("Difficulty", None)
        self.userID = components.get("UserID", None)
        self.function = components.get("Function", None)
        self.emoji = components.get("Emoji", None)
        self.eventNames = components.get("EventNames", None)
        
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
            await interaction.response.send_message("You are not the original User of this command.", ephemeral=True)
            return 

        try:
            if userID not in self.parentView.index:
                self.parentView.index[userID] = {}
            
            data = self.parentView.index[userID]
            selectedIndex = int(self.values[0]) #type: ignore

            data["EventIndex"] = selectedIndex #insert Eventindex into the parentView
            difficulty = data.get("Difficulty", self.difficulty)
            data["Difficulty"] = difficulty 
            
            if type(self.eventNames[-1]) == int and self.eventName != "Coop Mode": #coop passes a list of integers 
                embed, _ = self.function(self.eventNames[-1], self.eventNames[selectedIndex])
            else: 
                embed, _ = self.function(selectedIndex, difficulty)

            await interaction.response.edit_message(embed=embed)

        except Exception as e:
            await interaction.response.send_message(content=e, ephemeral=True)
