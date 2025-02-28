from discord.ext import commands 
import discord

class ErrorHandler(commands.Cog):
    def __init__(self, bot):

        self.bot = bot 

    @commands.Cog.listener()
    async def on_application_command_error(self, ctx: discord.ApplicationContext, error: discord.DiscordException):
         
        if isinstance(error, commands.CommandOnCooldown):
            self.title = "Command on Cooldown"
            self.message = f"You can reuse this command in {error.retry_after:.2f} seconds."
            
        else:
            match str(error):

                case e if "TileNotFound" in e:
                    self.title = "Tile Code not found." 
                    self.message = "The Tile Code you entered wasn't found. Please check your typing." 
              
                case e if "CTNotFound" in e:
                    self.title = "CT Event not found"
                    self.message = "This CT event does not exist."

                case e if "ChallengeCodeNotFound" in e:
                    self.title = "Challenge Code not found"
                    self.message = "The Challenge you were looking for does not exist."
                
                case e if "RequestNoSuccess" in e:
                    self.title = "Invalid Request"
                    self.message = "The bot was unable to fetch data from the api. Please try again."

                case e if "ServerDown" in e:
                    self.title = "Api Server Down"
                    self.message = "The Bot is online, but cannot recieve api information."
        
                case _:  
                    self.title = "Unexpected Error"
                    self.message = f"Something unexpected went wrong. \nError: {error}"
        
        embed = discord.Embed(title=f"**{self.title}**", description=self.message, color=discord.Color.red())
        embed.set_author(name=ctx.author.name, icon_url=ctx.author.avatar.url) #type: ignore
        embed.set_footer(text="*All command usages will be logged in our system.")
        await ctx.respond(embed=embed)
        return

def setup(bot):
    bot.add_cog(ErrorHandler(bot))
