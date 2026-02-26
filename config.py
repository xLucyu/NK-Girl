from dotenv import load_dotenv
import os

load_dotenv()

ADMINIDS = []

BOTTOKEN = os.getenv("BOT_TOKEN")
BOTID = os.getenv("BOT_ID")
GUILDID = os.getenv("GUILD_ID")
SUBCID = os.getenv("SUBMISSION_CHANNEL_ID")

# database connection

HOST = os.getenv("HOST")
PORT = os.getenv("PORT")
DATABASE = os.getenv("DATABASE")
USER = os.getenv("USER")
PASSWORD = os.getenv("PASSWORD")
