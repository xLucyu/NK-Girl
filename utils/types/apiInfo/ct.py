from dataclasses import dataclass, field 
from utils.types.apiInfo.metaData import BloonModifiers, Tower
from typing import List

@dataclass 
class Items: 
    _items: List[Tower] = []

@dataclass 
class StartRules:
    lives: int = 150
    cash: int = 650
    round: int = 1
    endRound: int = 1 

@dataclass 
class DcModel:
    startRules: StartRules = field(default_factory=StartRules)
    maxTowers: int = 1 
    disableMK: bool = False 
    disableSelling: bool = False
    bloonModifiers: BloonModifiers = field(default_factory=BloonModifiers)
    towers: Items = field(default_factory=Items)

@dataclass 
class GameData:
    selectedMap: str = "" 
    selectedMode: str = ""
    subGameType: int = 0
    selectedDifficulty: str = ""
    dcModel: DcModel = field(default_factory=DcModel)

@dataclass 
class TileCode:
    EventNumber: int = 1
    Code: str = ""
    TileType: str = "" 
    RelicType: str = ""
    GameData: GameData = field(default_factory=GameData) 
