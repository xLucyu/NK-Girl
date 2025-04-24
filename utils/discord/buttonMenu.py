import discord

class ButtonMenu(discord.ui.Button):

    def __init__(self, **components):
        
        self.parentView = components.get("View", None)
        self.userID = components.get("UserID", None)
        self.function = components.get("Function", None)
        self.layout = components.get("Layout", None) 
         
        super().__init__(
            label=(self.layout[0]),
            custom_id=self.layout[1],
            style=getattr(discord.ButtonStyle, self.layout[2])
        )

    async def callback(self, interaction:discord.Interaction):
        
        messageID = self.parentView.message.id
        userID = interaction.user.id #type: ignore

        if userID != self.userID:
            await interaction.response.send_message("You are not the original user of this command.", ephemeral=True)
            return
         
        try:
            difficulty = self.custom_id 
            if messageID not in self.parentView.index:
                self.parentView.index[messageID] = dict() 
            
            data = self.parentView.index[messageID] 
            data["Difficulty"] = difficulty 
            selectedIndex = data.get("EventIndex", 0) 
            embed, _ = self.function(selectedIndex, difficulty.lower()) #type: ignore
            await interaction.response.edit_message(embed=embed)
            self.parentView.message = await interaction.original_response()

        except:
            await interaction.response.send_message(content="Something went wrong, please try again.", ephemeral=True)   
