from dataclasses import dataclass 
from utils.types.metaData import BloonModifiers, Tower
from typing import List

@dataclass 
class Items: 
    _items: List[Tower]

@dataclass 
class StartRules:
    lives: int
    cash: int
    round: int
    endRound: int

@dataclass 
class DcModel:
    startRules: StartRules
    maxTowers: int 
    disableMK: bool 
    disableSelling: bool 
    bloonModifiers: BloonModifiers
    towers: Items 

@dataclass 
class GameData:
    selectedMap: str 
    selectedMode: str 
    subGameType: int 
    selectedDifficulty: str
    dcModel: DcModel

@dataclass 
class TileCode:
    EventNumber: int 
    Code: str 
    TileType: str 
    RelicType: str 
    GameData: GameData 
