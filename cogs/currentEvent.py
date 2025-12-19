from utils.dataclasses.main import NkData, Body
from typing import Tuple 

def getCurrentActiveEvent(mainData: NkData, currentTimeStamp: int) -> Tuple[int, Body]:
 
    try:
        return min(
            (
                (index, event)
                for index, event in enumerate(mainData.body)
                if event.end > currentTimeStamp
            ), key=lambda event: event[1].end  
        )
     
    except ValueError:
        return 0, mainData.body[0]
