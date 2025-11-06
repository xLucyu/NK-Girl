import discord 
from discord.ext import commands
from config import SUBCID
from database.logic.usage import UsageTable


class FeedbackModal(discord.ui.Modal):

    def __init__(self, submissionChannel: discord.TextChannel, user: str, avatar: str):

        self.submissionChannel = submissionChannel
        self.user = user
        self.avatar = avatar
        self.database = UsageTable()
        
        super().__init__(title="Feedback for NK-Girl")
        self.add_item(
            discord.ui.InputText(
                label = "Type of Feedback",
                placeholder = "Feedback/Error/Improvement",
                style = discord.InputTextStyle.short, 
            )
        )
        self.add_item(discord.ui.InputText(
                label = "Message",
                placeholder = "if it's an error, please paste the error message aswell",
                style = discord.InputTextStyle.long
            )
        )

    async def callback(self, interaction:discord.Interaction) -> None:

        commandTable = self.database.fetchCommands()
        submissionNumber = next((command[1] for command in commandTable if command[0] == "feedback"), 0)
        
        feedbackType = str(self.children[0].value)
        feedback = str(self.children[1].value) 
        if feedback:
            embed = discord.Embed(title=f"Feedback from {self.user}", color=discord.Color.nitro_pink())
            embed.add_field(name=f"Submisson ID {submissionNumber}", value="", inline=False)
            embed.add_field(name=f"Type of Submission: {feedbackType}", value=feedback, inline=False)
            embed.set_thumbnail(url=self.avatar)
            await self.submissionChannel.send(embed=embed)
            await interaction.response.send_message(f"Your submission was send! ID: {submissionNumber}", ephemeral=True)

class Feedback(commands.Cog):
    def __init__(self, bot: discord.Bot):

        self.bot = bot 

    @discord.slash_command(name="feedback", description="give feedback or submit an error",
                           integration_types = {discord.IntegrationType.user_install,
                                                discord.IntegrationType.guild_install})
    async def feedback(self, ctx: discord.ApplicationContext) -> None:

        user = ctx.author.name
        avatar = ctx.author.avatar
        submissionChannel = self.bot.get_channel(int(SUBCID)) #type: ignore 
        modal = FeedbackModal(submissionChannel, user, avatar)
        await ctx.send_modal(modal)

def setup(bot: discord.Bot):
    bot.add_cog(Feedback(bot))
