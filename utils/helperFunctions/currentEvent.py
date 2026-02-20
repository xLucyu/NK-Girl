from utils.dataclasses import Events, EventBody

def getCurrentActiveEvent(mainData: Events, currentTimeStamp: int, mode: str) -> EventBody:
 
    try:
        return min(
            ( 
                event 
                for event in mainData.body 
                if event.end > currentTimeStamp and event.type == mode 
            ), key = lambda event: event.end
        )
     
    except ValueError:
        raise ValueError("NoEventFound")
