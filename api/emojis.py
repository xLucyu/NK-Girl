import requests
from config import BOTTOKEN, BOTID


def getEmojis(url=f"https://discord.com/api/v10/applications/{BOTID}/emojis") -> dict | None:

    try:

        headers = {
            "Authorization": f"Bot {BOTTOKEN}",
            "Content-Type": "application/json"
        }
            
        response = requests.get(url, headers=headers)
        data = response.json()

        if data is None:
            return None

        items = data.get("items", None)       
        emotes = {emoji["name"]: emoji["id"] for emoji in items}
        
        return emotes
        

    except Exception:
        return 
