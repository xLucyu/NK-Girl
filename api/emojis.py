import requests
from config import BOTTOKEN 


def getEmojis(url):

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
        

    except Exception as e:
        raise e 
