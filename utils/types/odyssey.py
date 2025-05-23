from dataclasses import dataclass 
from typing import List, Any  

from utils.types.metaData import Tower 
from utils.types.metaData import Body  

@dataclass 
class OdysseyBody:
    id: str 
    isExtreme: bool 
    maxMonkeySeats: int 
    maxMonkeysOnBoat: int 
    maxPowerSlots: int 
    startingHealth: int 
    _rewards: List[Any]
    _availablePowers: List[Any]
    _availableTowers: Tower 
    maps: Body 

@dataclass 
class Odyssey:
    success: bool 
    body: OdysseyBody 
