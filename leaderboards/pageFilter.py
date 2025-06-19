import discord 

class PageModal(discord.ui.Modal):
    def __init__(self, **components):
        title = components.get("Title", None)
        label = components.get("Label", None)
        placeholder = components.get("Placeholder", None)
        self.buttonView = components.get("View", None)
        self.filter = components.get("Filter", None)

        super().__init__(title = title)
        self.add_item(
            discord.ui.InputText(
                label = label, 
                placeholder = placeholder, 
                style = discord.InputTextStyle.short,
                required = True
            )
        ) 

    async def callback(self, interaction:discord.Interaction):
        
        match self.filter:
            case "pageNumber":
                selectedPage = str(self.children[0].value)
        
                if (
                    not selectedPage.isdigit()
                    or self.buttonView.lbType == "race" and not 1 < int(selectedPage) <= 20
                    or not 1 < int(selectedPage) <= 40
                ): 
                    await interaction.response.send_message("Please enter a valid page number.", ephemeral = True)
                    return

            case "pageSearch":
                selectedPlayerName = str(self.children[0].value)
                selectedPage = 1

            case _:
                selectedPage = 1

        self.buttonView.page = int(selectedPage)
        self.buttonView.checkButtons()
        await self.buttonView.callback(interaction) 
