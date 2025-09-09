import discord 
from discord.ext import commands 
from cogs.baseCommand import BaseCommand
from database.events.index import EventTable
from utils.dataclasses.main import NkData

class Channel(commands.Cog):

    def __init__(self, bot: discord.Bot):
        self.bot = bot 
        self.events = EventTable()

    
    challenge = discord.SlashCommandGroup(
        "channel", 
        "",
        integration_types={
            discord.IntegrationType.guild_install
        }
    )
    
    @commands.cooldown(1, 5, commands.BucketType.user)
    @challenge.command(name = "add", description = "add a channel for the specific event")
    @discord.option(
        "event",
        description = "Pick the event, for which channel this should be.",
        option = ["Race", "Boss", "Odyssey"],
        required = True 
    )
    @discord.option(
        discord.TextChannel,
        description = "Pick a channel",
        required = True
    )
    async def add(self, ctx: discord.ApplicationContext, event: str, channel: discord.TextChannel):
        
        try:
            guildID = str(ctx.guild.id) 
            channelID = channel.id

            eventUrls = {
                "Race": {
                    "url": "https://data.ninjakiwi.com/btd6/races",
                    "column": "RaceProps"
                },
                "Boss": {
                    "url": "https://data.ninjakiwi.com/btd6/bosses",
                    "column": "BossProps"
                },
                "Odyssey": {
                    "url": "https://data.ninjakiwi.com/btd6/odyssey",
                    "column": "OdysseyProps"
                }
            }

            url = eventUrls[event]["url"]
            eventData = BaseCommand.useApiCall(url)
            mainData = BaseCommand.transformDataToDataClass(NkData, eventData)
            eventID = mainData.body[0].id 
            databaseColumn = eventUrls[event]["column"]

            eventProps = {
                "latestID": eventID, 
                "channel": channelID
            }

            self.events.appendData(guildID, eventProps, databaseColumn)
            await ctx.respond(f"The Event {event} was linked to: <#{channelID}>")

        except: 
            await ctx.respond("Something went wrong, please try again", ephemeral=True)



    @commands.cooldown(1, 5, commands.BucketType.user)
    @challenge.command(name = "remove", description = "remove a channel for the specific event")
    @discord.option(
        "event",
        description = "Pick the Event you want to remove.",
        option = ["Race", "Boss", "Odyssey"],
        required = True 
    )
    @discord.option(
        "channel",
        description="Pick a channel",
        choices = discord.TextChannel,
        required=True
    )
    async def remove(self, ctx: discord.ApplicationContext, event: str, channel: discord.TextChannel):
   

def setup(bot: discord.Bot):
    bot.add_cog(Channel(bot))
add     
        pass
