from enum import Enum 

class EventType(Enum):
    Race = "raceEvent"
    Boss = "bossBloon"
    Odyssey = "odysseyEvent"
    Collection = "collectableEvent"
    ContestedTerritory = "ct"
