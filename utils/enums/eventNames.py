from enum import Enum 

class EventType(Enum):
    Race = "raceEvent"
    Boss = "bossEvent"
    Odyssey = "odysseyEvent"
    Collection = "collectableEvent"
    ContestedTerritory = "ct"
