import math

def getNumberForEvent(eventTimeStamp: int, mode: str) -> int | None:

    eventsByFirstTimeStampAndDuration = {
        "race": [1544601600000, 7],
        "standard": [1533974400000, 1],
        "advanced": [1535097600000, 1],
        "ct": [1660082400000, 14],
        "odyssey": [1593532800000, 7]
    }

    if mode not in eventsByFirstTimeStampAndDuration:
        return None

    firstTimeStamp, duration = eventsByFirstTimeStampAndDuration[mode] 

    timeDifference = eventTimeStamp - firstTimeStamp
    calculateNumber = math.floor(timeDifference / (duration * 24 * 60 * 60 * 1000))
    return round(calculateNumber)
