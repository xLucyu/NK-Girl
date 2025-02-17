import requests

def getData(url):

    try:
    
        data = requests.get(url)
        if data.status_code == 200:
            return data.json() 

    except requests.exceptions.RequestException:
        return 

def getID(url, index):
    
    data = getData(url)

    if data is None:
        return None
    
    ids = data.get("body", None)
    selectedID = ids[index]
    
    apiData = {
        "Names": [name.get("name", None) for name in ids],
        "ID": selectedID.get("id", None),
        "TimeStamp": selectedID.get("start", None),
        "LBType": selectedID.get("scoringType", None),
        "Name": selectedID.get("name", None)
    }

    return apiData
    
