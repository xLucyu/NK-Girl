import discord
from leaderboards.pageFilter import PageModal

class ButtonView(discord.ui.View):

    def __init__(self, **components):

        super().__init__(timeout=300) 
        
        self.message = components.get("Message", None)
        self.totalScores = components.get("TotalScores", None)
        self.scoreType = components.get("ScoreType", None)
        self.lbType = components.get("Mode", None)
        self.submode = components.get("SubMode", None)
        self.playerCount = components.get("Players", None)
        self.userID = components.get("Author", None)
        self.function = components.get("Function", None)
        self.page = 1
        self.layout = components.get("Layout", None)
        self.url = components.get("URL", None) 
  
        for button in self.layout:

            button = discord.ui.Button(
                label = button[0],
                custom_id = button[1],
                style = getattr(discord.ButtonStyle, button[2]),
                disabled = True if button[1] == "-1" else False
            )
                        
            button.callback = self.callback
            self.add_item(button)
        
    async def callback(self, interaction:discord.Interaction, deferred=True): 

        if interaction.user.id != self.userID:
            await interaction.response.send_message("You are not the original user.", ephemeral=True)
            return 

        if deferred:
            await interaction.response.defer()
        
        selectedButton = str(interaction.custom_id)

        match selectedButton:

            case "searchPlayer":
                pass   

            case "searchPage":
                pass 

            case "1" | "-1":
                self.page += int(selectedButton)

        self.updateButtonState()


    def updateButtonState(self) -> None:

        for button in self.children:
            
            if not isinstance(button, discord.ui.Button):
                continue 
            
            if button.custom_id == "-1":
                button.disabled = self.page <= 1

            if button.custom_id == "1":

                pageLimit = 20 if self.lbType == "Race" else 40
                pageSize = 50 if self.lbType == "Race" else 25 

                button.disabled = (
                    self.page >= pageLimit 
                    or (self.page * pageSize) >= self.totalScores
                )


    async def on_timeout(self):

        try:
            if self.message:
                await self.message.edit(view=None)
        except discord.NotFound:
            pass
