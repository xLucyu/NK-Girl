from dataclasses import dataclass, field  
from typing import List, Any 
from utils.dataclasses.metaData import Tower

@dataclass 
class OdysseyBody:
    id: str = ""
    isExtreme: bool = False  
    maxMonkeySeats: int = 0
    maxMonkeysOnBoat: int = 0
    maxPowerSlots: int = 0
    startingHealth: int = 0
    _rewards: List[Any] = field(default_factory=List[Any])  
    _availablePowers: List[Any] = field(default_factory=List[Any])
    _availableTowers: List[Tower] = field(default_factory=list)
    maps: str = ""

@dataclass 
class Odyssey:
    success: bool = False 
    body: OdysseyBody = field(default_factory=OdysseyBody)
