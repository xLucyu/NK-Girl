from dataclasses import dataclass, field  
from typing import Any 
from utils.dataclasses import Tower, MetaBody

@dataclass
class MapsData:
    success: bool = True 
    body: list[MetaBody] = field(default_factory=list[MetaBody])

@dataclass 
class OdysseyBody:
    id: str = ""
    isExtreme: bool = False  
    maxMonkeySeats: int = 0
    maxMonkeysOnBoat: int = 0
    maxPowerSlots: int = 0
    startingHealth: int = 0
    _rewards: list[Any] = field(default_factory=list[Any])  
    _availablePowers: list[Any] = field(default_factory=list[Any])
    _availableTowers: list[Tower] = field(default_factory=list)
    maps: str = ""

@dataclass 
class Odyssey:
    success: bool = False 
    body: OdysseyBody = field(default_factory=OdysseyBody)
