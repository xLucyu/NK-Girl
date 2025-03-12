from api.fetchid import getID
from api.metadata import getBody, getMetaData 
from api.emojis import getEmojis
from utils.filter.filteredtowers import filtertowers
from utils.filter.filteredmodifiers import filtermodifiers

def baseCommand(urls, index=None):
    
    try:
        if index is not None:

            api = getID(urls, index=index) 

            if not api:
                return 

            metaData = api.get("MetaData", None) 

        else:
            metaData = urls #really only needed for challenge look up
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
            towers = filtertowers(stats["Odyssey"]["AvailableTowers"], emotes) #type: ignore 
            modifiers = None
        else:
            towers = filtertowers(stats.get("Towers"), emotes) #type: ignore
            modifiers = filtermodifiers(stats.get("Modifiers"), emotes) #type: ignore
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
