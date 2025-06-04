from dataclasses import dataclass, field 
from typing import List 
from utils.dataclasses.metaData import Tower

@dataclass
class Items:
    _items: List[Tower] = field(default_factory=list)

@dataclass
class StartRules:
    lives: int = 0
    cash: int = 650
    round: int = 1 
    endRound: int = 40

@dataclass 
class HealthMultipliers:
    bloons: float = 1.0
    moabs: float = 1.0

@dataclass 
class BloonModifiers:
    healthMultipliers: HealthMultipliers = field(default_factory=HealthMultipliers)
    speedMultiplier: float = 1.0
    moabSpeedMultiplier: float = 1.0
    regrowRateMultiplier: float = 1.0


@dataclass
class DcModel:
    startRules: StartRules = field(default_factory=StartRules)
    maxTowers: int = 0
    disableMK: bool = False
    disableSelling: bool = False 
    bloonModifiers: BloonModifiers = field(default_factory=BloonModifiers)
    towers: Items = field(default_factory=Items)

@dataclass 
class BossData:
    bossBloon: int = 0
    TierCount: int = 1

@dataclass
class cGameData:
    selectedMap: str = ""
    selectedMode: str = ""
    subGameType: int = 0
    selectedDifficulty: str = "Medium"
    dcModel: DcModel = field(default_factory=DcModel)
    bossData: BossData = field(default_factory=BossData)

@dataclass
class TileCode:
    EventNumber: int = 0
    Code: str = ""
    TileType: str = ""
    RelicType: str = ""
    GameData: cGameData = field(default_factory=cGameData)

