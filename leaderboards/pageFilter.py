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

        if self.filter == "pageNumber":
            selectedPage = str(self.children[0].value) 
        
            if not selectedPage.isdigit():
                await interaction.response.send_message("Please enter a valid page number.", ephemeral = True)
                return

            self.buttonView.page = int(selectedPage)
            await self.buttonView.callback(interaction)
