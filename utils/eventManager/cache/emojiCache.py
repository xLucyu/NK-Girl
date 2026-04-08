from api.wrapper import wrapper 
from config import BOTTOKEN, BOTID
from utils.dataclasses import URLS 

EMOJIURL = URLS["Emoji"].base.format(BOTID)

async def getEmojis() -> dict:
    
    emojiCache = {}

    if emojiCache:
        return emojiCache

    try:

        headers = {
            "Authorization": f"Bot {BOTTOKEN}",
            "Content-Type": "application/json"
        }
            
        data = await wrapper.fetch(url=EMOJIURL, headers=headers)

        if not data:
            raise ValueError() 

        items = data.get("items", None) 
        emojiCache = {emoji["name"]: emoji["id"] for emoji in items}
        
        return emojiCache 
        
    except Exception as e:

        raise ValueError(e)
