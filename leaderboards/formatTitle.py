from cogs.regex import splitNumbers 
from cogs.eventNumber import currentEventNumber, getCurrentCTEvent

def formatEventInfo(apiData, lbType, difficulty):
    
    match lbType:

        case "race":
            startTimeStamp = apiData.get("start")
            firstTimeStamp = 1544601600000
            eventNumber = currentEventNumber(startTimeStamp, firstTimeStamp)
            eventName = apiData.get("name")
            title = f"Race #{eventNumber} - {eventName}"

        case "boss":
            eventNumber = splitNumbers(apiData.get('name', None))
            eventName = apiData.get("bossType", None) 
            title = f"{difficulty.title()} {eventNumber}"

        case "ct":
           
            eventNumber = getCurrentCTEvent()
            title = f"Contested Territory #{eventNumber} - {difficulty.title()}"

        case _:
            return None

    return title
