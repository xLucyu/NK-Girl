import requests

def getData(url):

    try: 
        data = requests.get(url)
        if data.status_code == 200:
            return data.json() 

    except:
        return None 

def getID(urls, index):
    
    data = getData(urls.get("base"))

    if data is None:
        return None
    
    ids = data.get("body", None)
    selectedID = ids[index]
    
    apiData = {
        "Names": [name.get("name") for name in ids], 
        "TimeStamp": selectedID.get("start", None),
        "LBType": selectedID.get("scoringType", None),
        "Name": selectedID.get("name", None),
        "MetaData": selectedID.get(urls.get("extension"))
    }

    return apiData
    
