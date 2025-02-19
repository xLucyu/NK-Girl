import discord 
from utils.assets.urls import EVENTURLS
from cogs.basecommand import baseCommand
from datetime import datetime, timezone 

def challengeProfile(index, difficulty):

    

    # Get today's date range (UTC)
    now = datetime.now(timezone.utc)
    today_start = datetime(now.year, now.month, now.day, tzinfo=timezone.utc).timestamp() * 1000  # Start of the day
    today_end = today_start + 86400000 - 1  # End of the day (23:59:59.999)
    todays_challenge = [c for c in challenges if today_start <= c["createdAt"] <= today_end]
    print(todays_challenge)
    
    urls = {
        "base": "https://data.ninjakiwi.com/btd6/challenges/filter/daily",
        "extension": f"metadata"
    }

    NKDATA = baseCommand(urls, index)
    print(NKDATA)


