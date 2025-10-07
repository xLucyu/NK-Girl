import discord 
from discord.ext import commands
from database.channels.index import EventTable


class Channel(commands.Cog):

    def __init__(self, bot: discord.Bot):

        self.bot = bot 
        self.eventTable = EventTable()
 
    challenge = discord.SlashCommandGroup(
        "channel", 
        "",
        integration_types={
            discord.IntegrationType.guild_install
        },
        default_member_permission=discord.Permissions(manage_guild=True)
    )
    
    @commands.cooldown(1, 5, commands.BucketType.user)
    @challenge.command(name = "add", description = "add a channel for the specific event")
    @discord.option(
        "event",
        description = "Events will be automatically posted in this channel",
        choices = ["Race", "Boss", "Odyssey"],
        required = True 
    )
    @discord.option(
        "channel",
        description = "Pick a channel",
        channel_types = [discord.ChannelType.news, discord.ChannelType.text],
        required = True 
    )
    async def add(self, ctx: discord.ApplicationContext, event: str, channel: discord.TextChannel):
        
        try: 
            guildID = ctx.guild.id 
            channelID = str(channel.id) 
            
            self.eventTable.appendChannelPerGuild(guildID, channelID, event)
            await ctx.respond(f"Set Event {event} to Channel: <#{channel.id}>")

        except: 
            raise ValueError()



    @commands.cooldown(1, 5, commands.BucketType.user)
    @challenge.command(name = "remove", description = "remove a channel for the specific event")
    @discord.option(
        "event",
        description = "Pick the Event you want to remove.",
        choices = ["Race", "Boss", "Odyssey"],
        required = True 
    )
    async def remove(self, ctx: discord.ApplicationContext, event: str):
       
        try: 
            guildID = ctx.guild.id 
            oldChannelID = self.eventTable.removeChannelFromGuild(guildID, event)
            
            if oldChannelID:
                await ctx.respond(f"Removed event {event} from <#{oldChannelID}>")

            else:
                raise ValueError("NoChannelSet")
        
        except:
            raise ValueError("NoChannelSet")

def setup(bot: discord.Bot):
    bot.add_cog(Channel(bot))
