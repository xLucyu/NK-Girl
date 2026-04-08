import discord 
from discord.ext import commands
from database.logic.guilds import GuildTable

class EventCog(commands.Cog):

    def __init__(self, bot: discord.Bot, guildTable: GuildTable):

        self.bot = bot
        self.database = guildTable

    events = discord.SlashCommandGroup(
        "event", 
        "",
        integration_types = {
            discord.IntegrationType.guild_install
        }
    )
    @events.command(
        name = "post",
        description = "post an event manually"
    )
    @discord.option(
        "event",
        description = "choose the event you want to post",
        choices = ["Race", "Odyssey", "Boss", "Collection"],
        required = True 
    )
    async def post(self, ctx: discord.ApplicationContext, event: str):

        await ctx.response.defer()

        if not ctx.author.guild_permissions.manage_guild:
            await ctx.respond("You don't have permission to run this command.", ephemeral=True)
            return

        eventManager: EventManager = self.bot.get_cog("EventManager")
        channelIDs = self.database.fetchAllRegisteredChannels(event)

        if not channelIDs:
            await ctx.respond(f"No channel registered for **{event}**.", ephemeral=True)
            return

        channel = self.bot.get_channel(int(channelIDs[0]))

        if not channel:
            await ctx.respond(f"No valid channel found for **{event}**.", ephemeral=True)
            return

        try:

            eventChecks = EVENTS_TO_CHECK[event]

            eventID = eventManager.getCurrentEventCache(event)

            embeds = await eventManager.buildEventEmbeds(
                event,
                eventID,
                eventChecks
            )

            if not embeds:
                await ctx.respond("Failed to generate event embeds.", ephemeral=True)
                return

            await channel.send(embeds=embeds)

            await ctx.respond(f"Successfully posted **{event}**.")

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
        choices = ["Race", "Odyssey", "Boss", "Collection"],
        required = True 
    )
    async def edit(self, ctx: discord.ApplicationContext, message_id: str, event: str):

        await ctx.response.defer()

        if not ctx.author.guild_permissions.manage_guild:
            await ctx.respond("You don't have permission to run this command.", ephemeral=True)
            return

        eventManager: EventManager = self.bot.get_cog("EventManager")
        channelIDs = self.database.fetchAllRegisteredChannels(event)

        if not channelIDs:
            await ctx.respond(f"No channel registered for **{event}**.", ephemeral=True)
            return

        channel = await self.bot.fetch_channel(int(channelIDs[0]))

        try:

            message: discord.Message = await channel.fetch_message(int(message_id))

            eventChecks = EVENTS_TO_CHECK[event]

            eventID = eventManager.getCurrentEventCache(event)

            embeds = await eventManager.buildEventEmbeds(
                event,
                eventID,
                eventChecks
            )

            if not embeds:
                await ctx.respond("Failed to rebuild event embeds.", ephemeral=True)
                return

            await message.edit(embeds=embeds)

            await ctx.respond(f"Successfully updated **{event}**.")

        except Exception as e:
            raise ValueError(e)
