import discord
from leaderboards.multiplayer import generateLeaderboard

class ButtonView(discord.ui.View):

    def __init__(self, **components):
        super().__init__() 

        self.lbType = components.get("Mode", None)
        self.teamScores = components.get("TeamScores", None)
        self.submode = components.get("SubMode", None)
        self.playerCount = components.get("players", None)
        self.eventData = components.get("EventData", None)
        self.userID = components.get("Author", None)
        self.function = components.get("Function", None)
        self.page = components.get("Page", None)
        self.layout = components.get("Layout", None)
 
        
        for button in self.layout:
            button = discord.ui.Button(
                label = button[0],
                custom_id = button[1],
                style = getattr(discord.ButtonStyle, button[2]),
                disabled = True if self.page == 1 and button[1] == "remove1" else False
            )
            button.callback = self.callback 
            self.add_item(button)
        
    async def callback(self, interaction:discord.Interaction):
        
        userID = interaction.user.id #type: ignore

        if userID != self.userID:
            await interaction.response.send_message("You are not the original user of this command.", ephemeral=True)
            return  

        self.handlePage(interaction)
        
        if self.submode:
            self.submode = self.submode.lower()

        if self.teamScores:
            playerData, totalscores = generateLeaderboard(self.teamScores, self.page, self.lbType, self.submode) #type: ignore
            embed = discord.Embed(title=self.eventData, description=playerData, color=discord.Color.blue())
            embed.set_footer(text=f"Total Entires: {totalscores}")
        else:
            embed, _, _ = self.function(self.lbType, self.page, self.submode, self.playerCount)

        await interaction.response.edit_message(embed=embed, view=self)

    def handlePage(self, interaction):
        
        movePage = interaction.custom_id

        if movePage == "add1":
            self.page += 1 
        else:
            self.page -= 1 

        for button in self.children:
            if button.custom_id == "remove1": #type: ignore 
                button.disabled = self.page <= 1 #type: ignore
