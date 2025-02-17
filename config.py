from dotenv import load_dotenv
import os

load_dotenv()

BOTTOKEN = os.getenv("BOT_TOKEN")
BOTID = os.getenv("BOT_ID")
GUILDID = os.getenv("GUILD_ID")
TILESURL = os.getenv("CT_TILES_URL")
