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
        
        messageID = self.parentView.message.id
        userID = interaction.user.id #type: ignore

        if userID != self.userID:
            await interaction.response.send_message("You are not the original User of this command.", ephemeral=True)
            return 

        try:
            await interaction.response.defer()

            if messageID not in self.parentView.index:
                self.parentView.index[messageID] = dict()
            
            data = self.parentView.index[messageID]
            selectedIndex = int(self.values[0]) #type: ignore

            data["EventIndex"] = selectedIndex #insert Eventindex into the parentView
            difficulty = data.get("Difficulty", self.difficulty)

            if difficulty is not None:
                difficulty = difficulty.lower()
            data["Difficulty"] = difficulty 
            
            if self.tiles: 
                embed, _ = self.function(self.ctEventIndex, self.tiles[selectedIndex][0])
            else: 
                embed, _ = self.function(selectedIndex, difficulty)

            await interaction.edit_original_response(embed=embed)
            self.parentView.message = await interaction.original_response()   

        except Exception:
            await interaction.response.send_message(content="Something went wrong, please try again.", ephemeral=True)
