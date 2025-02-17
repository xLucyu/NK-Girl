import discord

class SelectMenu(discord.ui.Select):

    def __init__(self, userID, event, eventNames, function, difficulty, index, emoji):
        
        self.userID = userID 
        self.event = event
        self.eventNames = eventNames
        self.function = function 
        self.difficulty = difficulty
        self.index = index
        self.emoji = emoji
                 
        options = [
            discord.SelectOption(label=str(name), value=str(eventindex), emoji=self.emoji)
            for eventindex, name in enumerate(self.eventNames[:24]) #last index of cts is event number lol 
        ]

        super().__init__(
            placeholder = f"Select a {self.event}",
            options=options,
            min_values=1,
            max_values=1,
            disabled=False
        )

    async def callback(self, interaction: discord.Interaction):
         

        if interaction.user.id != self.userID: #type: ignore
            await interaction.response.send_message("You are not the original user of this command.", ephemeral=True)
            return
            
        try: 
            self.index = int(self.values[0]) #type: ignore 

            if type(self.eventNames[-1]) == int:
                embed, _ = self.function(self.eventNames[24], self.eventNames[self.index]) #last index is eventnumber
            else: 
                embed, _ = self.function(self.index, self.difficulty)
            await interaction.response.edit_message(embed=embed, view=self.view)
        except:
            await interaction.response.edit_message(content="Something went wrong, please try again.")
