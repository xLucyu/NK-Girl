from discord.ext import commands 
import discord

class ErrorHandler(commands.Cog):

    def __init__(self, bot: discord.Bot):

        self.bot = bot
  
    @commands.Cog.listener()
    async def on_application_command_error(self, ctx: discord.ApplicationContext, error: discord.DiscordException) -> None:

        if isinstance(error, commands.CommandOnCooldown):
            title = "Command on Cooldown"
            message = f"You can reuse this command in {error.retry_after:.2f} seconds."
            
        else:
            match str(error):

                case e if "TileNotFound" in e:
                    title = "Tile Code not found." 
                    message = "The Tile Code you entered wasn't found. Please check your typing."
                
                case e if "CTNotFound" in e:
                    title = "CT Event not found"
                    message = "This CT event does not exist."
  
                case e if "ChallengeCodeNotFound" in e:
                    title = "Challenge Code not found"
                    message = "The Challenge you were looking for does not exist."
                  
                case e if "RequestNoSuccess" in e:
                    title = "Invalid Request"
                    message = "The bot was unable to fetch data from the api. Please try again."
  
                case e if "ServerDown" in e:
                    title = "Api Server Down"
                    message = "The Bot is online, but cannot recieve api information."

                case e if "InvalidTimeFormat" in e:
                    title = "Invalid Time Format"
                    message = "Please make sure you're following the time format. Negative times are also not allowed!"

                case e if "InvalidStartRound" in e:
                    title = "Invalid Start Round"
                    message = "The Start Round can't be higher than the End Round."

                case e if "StartRoundOutOfBounce" in e:
                    title = "Invalid Start Round"
                    message = "The Start Round has to be inbetween 1 and 139."

                case e if "EndRoundOutOfBounce" in e:
                    title = "Invalid End Round"
                    message = "The End Round has to be inbetween 2 and 140."

                case e if "GoalTimeTooLow" in e:
                    title = "Invalid Goal Time"
                    message = "You entered an impossible time to achieve."

                case e if "NoChannelSet" in e:
                    title = "No Channel Set"
                    message = "Please add this event to a channel first before deleting it."
          
                case _:  
                    title = "Unexpected Error"
                    message = f"Something unexpected went wrong. \nError: {error}"
          
        embed = discord.Embed(title=f"**{title}**", description=message, color=discord.Color.red())
        embed.set_author(name=ctx.author.name, icon_url=ctx.author.avatar.url) 
        await ctx.respond(embed=embed)
        return

def setup(bot: discord.Bot):
    bot.add_cog(ErrorHandler(bot))
