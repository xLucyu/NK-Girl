import discord 
from discord.ext import commands
from utils.logging.eventManager import EventManager
from database.logic.guilds import GuildTable

class Event(commands.Cog):

    def __init__(self, bot: discord.Bot, guildTable: GuildTable):

        self.bot = bot
        self.database = guildTable


    events = discord.SlashCommandGroup(
        "event", 
        "",
        integration_types={
            discord.IntegrationType.guild_install
        }
    )


    @events.command(name="post", description="post an event manually")
    @discord.option(
        "event",
        description = "choose the event you want to post",
        choices = ["Race", "Odyssey", "Boss"],
        required = True 
    )
    async def post(self, ctx: discord.ApplicationContext, event: str):

        await ctx.response.defer()

        eventManager: EventManager = self.bot.get_cog("EventManager")

        if not ctx.author.guild_permissions.manage_guild:
            await ctx.respond("You don't have permission to run this command.", ephemeral = True)
            return 

        guildID = str(ctx.guild.id)
        channelID = eventManager.getRegisteredChannels(event, guildID)

        if not channelID:
            return

        channelObject = self.bot.get_channel(int(channelID))

        if not channelObject:
            await ctx.respond(f"No Channel has been set for {event} in this server.", ephemeral = True)
            return
        
        try:

            eventEmbeds = eventManager.getEventEmbeds(guildID, event, isManual=True)

            if not eventEmbeds:
                return

            await channelObject.send(embeds=eventEmbeds) 
            await ctx.respond(f"Succesfully posted **{event}** in this server.")

        except Exception as e:
            raise ValueError(e)

        
    @events.command(name="edit", description="overwrite an already existing message posted by the bot")
    @discord.option(
        "message_id",
        description = "enter the id for the message you want to change",
        required = True
    )
    @discord.option(
        "event",
        description = "choose the event you want to post",
        choices = ["Race", "Odyssey", "Boss"],
        required = True 
    )
    async def edit(self, ctx: discord.ApplicationContext, message_id: str, event: str):

        await ctx.response.defer()

        eventManager: EventManager = self.bot.get_cog("EventManager")

        if not ctx.author.guild_permissions.manage_guild:
            await ctx.respond("You don't have permission to run this command.", ephemeral = True)
            return 
        
        guildID = str(ctx.guild.id)
        channelID = eventManager.getRegisteredChannels(event, guildID)

        if not channelID:
            return

        channelObject = await self.bot.fetch_channel(int(channelID))

        try:
            message: discord.Message = await channelObject.fetch_message(int(message_id))
            eventEmbeds = eventManager.getEventEmbeds(guildID, event, isManual=True)

            if not eventEmbeds:
                return 

            await message.edit(embeds = eventEmbeds)
            await ctx.respond(f"Succesfully updated {event} for this guild")

        except Exception as e:
            raise ValueError(e)
