import math

def getNumberForEvent(eventTimeStamp: int, mode: str) -> int | None:

    eventsByFirstTimeStampAndDuration = {
        "Race": [1544601600000, 7],
        "Standard": [1533974400000, 1],
        "Advanced": [1535097600000, 1],
        "CT": [1660082400000, 14],
        "Odyssey": [1593532800000, 7]
    }

    if mode not in eventsByFirstTimeStampAndDuration:
        return 

    firstTimeStamp, duration = eventsByFirstTimeStampAndDuration[mode] 

    timeDifference = eventTimeStamp - firstTimeStamp
    calculateNumber = math.floor(timeDifference / (duration * 24 * 60 * 60 * 1000))
    return round(calculateNumber)
