from dataclasses import dataclass 
from typing import List, Optional
from utils.dataclasses.metaData import BloonModifiers, Tower

@dataclass
class Items:
    _items: Optional[List[Tower]] = None

@dataclass
class StartRules:
    lives: Optional[int] = None
    cash: Optional[int] = None
    round: Optional[int] = None
    endRound: Optional[int] = None

@dataclass
class DcModel:
    startRules: Optional[StartRules] = None
    maxTowers: Optional[int] = None
    disableMK: Optional[bool] = None
    disableSelling: Optional[bool] = None
    bloonModifiers: Optional[BloonModifiers] = None
    towers: Optional[Items] = None

@dataclass
class GameData:
    selectedMap: Optional[str] = None
    selectedMode: Optional[str] = None
    subGameType: Optional[int] = None
    selectedDifficulty: Optional[str] = None
    dcModel: Optional[DcModel] = None

@dataclass
class TileCode:
    EventNumber: Optional[int] = None
    Code: Optional[str] = None
    TileType: Optional[str] = None
    RelicType: Optional[str] = None
    GameData: Optional[GameData] = None

