import math
from api.fetchId import getID

def currentEventNumber(startTimeStamp, firstTimeStamp):
     
    timeDifference = startTimeStamp - firstTimeStamp
    currentNumber = math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000))
    return round(currentNumber)


def getCurrentCTEvent(): #this is really just for clean up 
    
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
    current_Number = math.floor(timeDifference / (14 * 24 * 60 * 60 * 1000)) #ct is only every 2 weeks
    return round(current_Number)

def getcurrentDailyNumber(firstTimeStamp, currentTimeStamp):
    
    timeDifference = currentTimeStamp - firstTimeStamp 
    current_Number = math.floor(timeDifference / (24 * 60 * 60 * 1000)) #daily challenges
    return round(current_Number) 
