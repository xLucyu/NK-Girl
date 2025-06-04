import math

def getNumberForEvent(eventTimeStamp: int, mode: str) -> int:
    eventsByFirstTimeStampAndDuration = {
        "race": [1544601600000, 7],
        "normal": [1533974400000, 1],
        "advanced": [1535097600000, 1],
        "ct": [1660082400000, 14]
    }

    firstTimeStamp = eventsByFirstTimeStampAndDuration[mode][0]
    duration = eventsByFirstTimeStampAndDuration[mode][1]

    timeDifference = eventTimeStamp - firstTimeStamp
    calculateNumber = math.floor(timeDifference / (duration * 24 * 60 * 60 * 1000))
    return round(calculateNumber)
