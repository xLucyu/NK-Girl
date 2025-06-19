import requests 

BOTID = "1294045105594040431"
BOTTOKEN = "MTI5NDA0NTEwNTU5NDA0MDQzMQ.GpNU3V.eCXs7ReqVTL7CupNxvjpfj5W86OiAFODyRXDlk" 


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
