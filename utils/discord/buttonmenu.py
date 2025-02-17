import discord

class ButtonMenu(discord.ui.Button):

    def __init__(self, function, userID, label, id, style):
        
        self.function = function
        self.userID = userID

        super().__init__(label=label,
                         custom_id=id, 
                         style=getattr(discord.ButtonStyle, style)
                         )

    async def callback(self, interaction:discord.Interaction):

        try: 
            if interaction.user.id != self.userID: #type: ignore
                await interaction.response.send_message("You are not the original user of this command.", ephemeral=True)
                return

            embed, _ = self.function(index=0, difficulty=self.custom_id)
            await interaction.response.edit_message(embed=embed)

        except:
            await interaction.response.send_message("Something went wrong, please try again.")
