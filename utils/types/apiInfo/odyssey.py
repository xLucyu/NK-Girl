from dataclasses import dataclass, field 
from typing import List, Any  

from utils.types.apiInfo.metaData import Tower 
from utils.types.apiInfo.metaData import Body  

@dataclass 
class OdysseyBody:
    id: str = ""
    isExtreme: bool = False  
    maxMonkeySeats: int = 0
    maxMonkeysOnBoat: int = 0
    maxPowerSlots: int = 0
    startingHealth: int = 0
    _rewards: List[Any] = []
    _availablePowers: List[Any] = []
    _availableTowers: Tower = field(default_factory=Tower)
    maps: Body = field(default_factory=Body)

@dataclass 
class Odyssey:
    success: bool = True 
    body: OdysseyBody = field(default_factory=OdysseyBody)
