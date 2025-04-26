import discord

class ButtonView(discord.ui.View):

    def __init__(self, **components):
        super().__init__(timeout=10) 
        
        self.message = components.get("Message", None)
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
        
        userID = interaction.user.id #type: ignore

        if userID != self.userID:
            await interaction.response.send_message("You are not the original user of this command.", ephemeral=True)
            return  

        self.handlePage(interaction)

        embed, _ = self.function(self.lbType, self.page, self.submode, self.playerCount, self.teamScores)

        await interaction.response.edit_message(embed=embed, view=self)
        self.message = await interaction.original_response()

    def handlePage(self, interaction):
         
        movePage = interaction.custom_id 
        self.page += int(movePage)

        for button in self.children:
            if button.custom_id == "-1": #type: ignore 
                button.disabled = self.page <= 1 #type: ignore


    async def on_timeout(self):
        
        try:
            if self.message:
                await self.message.edit(view=None)
        except discord.NotFound:
            pass

