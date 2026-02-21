from utils.dataclasses import Events, EventBody

def getCurrentActiveEvent(mainData: Events, currentTimeStamp: int, eventType: str) -> EventBody:
 
    try:
        return next(  
            event 
            for event in mainData.body 
            if event.end > currentTimeStamp and event.type == eventType
        )
     
    except ValueError:
        raise ValueError("NoEventFound")
