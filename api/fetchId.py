import requests

def getData(url):

    try: 
        data = requests.get(url) 
        match data.status_code:
            case 200:
                return data.json()
            case 400 | 403 | 404 :
                raise ValueError("RequestNoSuccess")
            case 500 | 502 | 503 | 504:
                raise ValueError("ServerDown")
            case _:
                raise ValueError()

    except requests.exceptions.RequestException as e:
        raise ValueError(e)

def getCurrentActiveLeaderboard(ids: dict, leaderboardApiKey: str) -> dict | None:
    # this is used to check for the latest leaderboard which has players in them since they get released early
    for currentApiIndex in ids: 
        if currentApiIndex.get(leaderboardApiKey) != 0:
            return currentApiIndex 

    return None 

def getID(urls: dict, index: int) -> dict | None:
     
    data = getData(urls.get("base", None))
 
    ids = data.get("body", None) 
    selectedID = ids[index] 
    leaderboardApiKey = urls.get("totalscores", None)  

    if leaderboardApiKey: # will check if leaderboard has a key for total players 
        selectedID = getCurrentActiveLeaderboard(ids, leaderboardApiKey)

    if not selectedID:
        return None 
            
    return {
        "Names": [name.get("name") for name in ids if ids], 
        "MetaData": selectedID.get(urls.get("extension", None)),
        "Data": selectedID
    } 
