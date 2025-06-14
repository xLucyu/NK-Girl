import discord 

class ButtonView(discord.ui.View):

    def __init__(self, **components):
        super().__init__(timeout=300) 
        
        self.message = components.get("Message", None)
        self.totalScores = components.get("TotalScores", None)
        self.scoreType = components.get("ScoreType", None)
        self.lbType = components.get("Mode", None)
        self.teamScores = components.get("TeamScores", None)
        self.submode = components.get("SubMode", None)
        self.playerCount = components.get("Players", None)
        self.userID = components.get("Author", None)
        self.function = components.get("Function", None)
        self.page = components.get("Page", None)
        self.layout = components.get("Layout", None) 
  
        for button in self.layout:
            button = discord.ui.Button(
                label = button[0],
                custom_id = button[1],
                style = getattr(discord.ButtonStyle, button[2]),
                disabled = True if button[1] == "-1" else False
            )
            button.callback = self.callback 
            self.add_item(button)
        
    async def callback(self, interaction:discord.Interaction): 
        await interaction.response.defer()

        userID = interaction.user.id #type: ignore

        if userID != self.userID:
            await interaction.response.send_message("You are not the original user of this command.", ephemeral=True)
            return  

        self.handlePage(interaction)
        
        embed, _, _, _ = self.function(self.lbType, self.page, self.submode, self.playerCount, self.teamScores, self.scoreType)

        await interaction.edit_original_response(embed=embed, view=self)
        self.message = await interaction.original_response()

    def handlePage(self, interaction):
         
        movePage = interaction.custom_id 
        self.page += int(movePage)

        for button in self.children:
            if button.custom_id == "-1": 
                button.disabled = self.page <= 1

            elif button.custom_id == "searchPage":
                pass 

            elif button.custom_id == "searchPlayer":
                pass

            if self.lbType == "race" and button.custom_id == "1":
                button.disabled = self.page >= 20 or (self.page * 50) >= self.totalScores
            else:
                if button.custom_id == "1":
                    button.disabled = self.page >= 40 or (self.page * 25) >= self.totalScores

    async def on_timeout(self):
        
        try:
            if self.message:
                await self.message.edit(view=None)
        except discord.NotFound:
            pass
