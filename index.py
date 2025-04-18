from config import BOTTOKEN
import discord, os


bot = discord.Bot(intents=discord.Intents.all())

@bot.event
async def on_ready():
     
    for guild in bot.guilds:
        
        print(guild)

def load_cogs(bot) -> None:

    for file in os.listdir('./cogs/commands/'):
        if file.endswith(".py"):
            bot.load_extension(f"cogs.commands.{file[:-3]}")

    bot.load_extension("utils.logging.errorHandler")
    bot.load_extension("utils.logging.logger")


def main() -> None:

    load_cogs(bot) 
    bot.run(BOTTOKEN)

main()
