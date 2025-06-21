import discord
from leaderboards.pageFilter import PageModal

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
        
    async def callback(self, interaction:discord.Interaction): 
        userID = interaction.user.id #type: ignore

        if userID != self.userID:
            await interaction.response.send_message("You are not the original user of this command.", ephemeral=True)
            return 

        selectedButton = str(interaction.custom_id)
        match selectedButton:
            case "searchPage":
                modal = self.generatePageModal()
                await interaction.response.send_modal(modal)
                return 
            
            case "searchPlayer":
                modal = self.handleSearchPlayer()
                await interaction.response.send_modal(modal)
                return

            case "1" | "-1":
                await interaction.response.defer()
                self.page += int(selectedButton) 
 
        self.checkButtons()
        await self.updateLeaderboard(interaction) 

    async def updateLeaderboard(self, interaction: discord.Interaction):

        lbData = self.function(self.lbType, self.page, self.submode, self.playerCount, self.teamScores, self.scoreType) 
        await interaction.edit_original_response(embed=lbData.get("Embed"), view=self)
        self.message = await interaction.original_response()


    def checkButtons(self) -> None:
        for button in self.children:
            if not isinstance(button, discord.ui.Button):
                return 

            if button.custom_id == "-1":
                button.disabled = self.page <= 1 

            if button.custom_id == "1": 
                if self.lbType == "race":
                    button.disabled = self.page >= 20 or (self.page * 50) >= self.totalScores
                else:
                    button.disabled = self.page >= 40 or (self.page * 25) >= self.totalScores
                return 
        

    def generatePageModal(self): 
        return PageModal(  
            Title = "Search for a page on the leaderboard!",
            Label = "Enter the page number",
            Placeholder = "Please only enter a full number.",
            View = self,  
            Filter = "pageNumber"
            ) 

    def handleSearchPlayer(self):
        return PageModal(
            Title = "Search for a player on the leaderboard!",
            Label = "Enter a player name",
            Placeholder = "Please enter a valid player name",
            View = self,
            Url = self.url,
            Filter = "pageSearch" 
        )

    async def on_timeout(self):
        try:
            if self.message:
                await self.message.edit(view=None)
        except discord.NotFound:
            pass
