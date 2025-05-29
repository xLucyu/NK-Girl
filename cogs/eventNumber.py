import math
from api.fetchId import getID

def getCurrentEventNumber(startTimeStamp: int, firstTimeStamp: int) -> int: 
    timeDifference = startTimeStamp - firstTimeStamp
    currentNumber = math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000))
    return round(currentNumber)

def getCurrentCTEvent() -> int | None: 
    urls = {
        "base": "https://data.ninjakiwi.com/btd6/ct"
    }

    ctIndex = getID(urls, index=0)

    if not ctIndex:
        return  

    ctIndex = ctIndex.get("Data", None)
     
    startTimeStamp = 1660082400000
    currentTimeStamp = ctIndex.get("start", None) 
    timeDifference = currentTimeStamp - startTimeStamp
    currentNumber = math.floor(timeDifference / (14 * 24 * 60 * 60 * 1000)) #ct is only every 2 weeks
    return round(currentNumber)

def getcurrentDailyNumber(firstTimeStamp: int, currentTimeStamp: int) -> int:
    timeDifference = currentTimeStamp - firstTimeStamp 
    currentNumber = math.floor(timeDifference / (24 * 60 * 60 * 1000)) #daily challenges
    return round(currentNumber) 
