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
        

def getID(urls, index):
    
    data = getData(urls.get("base", None))
    
    ids = data.get("body", None) 
    selectedID = ids[index]

    apiData = {
        "Names": [name.get("name") for name in ids if ids], 
        "MetaData": selectedID.get(urls.get("extension", None)),
        "Data": selectedID 
    } 

    return apiData 
