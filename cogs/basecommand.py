from api.fetchid import getID
from api.metadata import getBody, getMetaData 
from api.emojis import getEmojis
from utils.filter.filteredtowers import filtertowers
from utils.filter.filteredmodifiers import filtermodifiers
from config import BOTID

def baseCommand(urls, index):
    
    try:
        api = getID(url=urls.get("base"), index=index)

        if not api:
            return 

        ID = api.get("ID", None)
        body = getBody(url=f"{urls.get('base')}/{ID}/{urls.get('extensions')}")
         
        if not body:
            return 

        stats = getMetaData(body)
        if not stats:
            return 

        emotes = getEmojis(url=f"https://discord.com/api/v10/applications/{BOTID}/emojis")
        
        odysseymapsKey = stats.get("Maps", None)
        
        if odysseymapsKey:
            maps = getBody(url=odysseymapsKey)
            towers = filtertowers(stats["Odyssey"]["AvailableTowers"], emotes)
            modifiers = None
        else:
            towers = filtertowers(stats.get("Towers"), emotes) 
            modifiers = filtermodifiers(stats.get("Modifiers"), emotes) #type: ignore
            maps = None 

    except:
        return 

    return {

        "Api": api,
        "Stats": stats,
        "Emotes": emotes,
        "Maps": maps,
        "Towers": towers,
        "Modifiers": modifiers

    }
