from dataclasses import dataclass 
from typing import List, Any, Optional  
from utils.dataclasses.metaData import Tower 
from utils.dataclasses.metaData import Body  

@dataclass 
class OdysseyBody:
    id: Optional[str] = None
    isExtreme: Optional[bool] = None  
    maxMonkeySeats: Optional[int] = None
    maxMonkeysOnBoat: Optional[int] = None
    maxPowerSlots: Optional[int] = None
    startingHealth: Optional[int] = None
    _rewards: Optional[List[Any]] = None 
    _availablePowers: Optional[List[Any]] = None
    _availableTowers: Optional[Tower] = None
    maps: Optional[Body] = None

@dataclass 
class Odyssey:
    success: Optional[bool] = None
    body: Optional[OdysseyBody] = None
