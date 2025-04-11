from api.fetchId import getID
from api.metaData import getBody, getMetaData 
from api.emojis import getEmojis
from utils.filter.filterTowers import filterTowers
from utils.filter.filterBloonsModifiers import filterModifiers

def baseCommand(urls: dict, index=None) -> dict | None:
    
    try:
        if index is not None:

            api = getID(urls, index) 

            if not api:
                return 

            metaData = api.get("MetaData", None) 

        else:
            metaData = urls.get("base", None) #really only needed for challenge look up
            api = None

        body = getBody(url=metaData)
        
        if not body:
            return 

        stats = getMetaData(body) 

        if not stats:
            return 

        emotes = getEmojis() 
        odysseymapsKey = stats.get("Maps", None)
        
        if odysseymapsKey:
            maps = getBody(url=odysseymapsKey)
            towers = filterTowers(stats["Odyssey"]["AvailableTowers"], emotes) #type: ignore 
            modifiers = None
        else:
            towers = filterTowers(stats.get("Towers", None), emotes) #type: ignore
            modifiers = filterModifiers(stats.get("Modifiers", None), emotes) #type: ignore
            maps = None 

    except:
        return None 

    return {
        "Api": api,
        "Stats": stats,
        "Emotes": emotes,
        "Maps": maps,
        "Towers": towers,
        "Modifiers": modifiers
    }
