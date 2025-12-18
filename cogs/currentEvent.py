from utils.dataclasses.main import NkData, Body
from typing import Tuple 

def getCurrentActiveEvent(mainData: NkData, currentTimeStamp: int) -> Tuple[int, Body]:
 
    validEvents = [
        (index, event)
        for index, event in enumerate(mainData.body)
        if event.end > currentTimeStamp
    ]

    if validEvents:
        return min(validEvents, key = lambda event: event[1].end)

    return 0
