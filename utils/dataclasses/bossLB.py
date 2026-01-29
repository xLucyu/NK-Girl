from dataclasses import dataclass, field
from typing import Optional

@dataclass
class ScoreParts:
    bossTier: int = 0
    score: int = 0
    secondScore: Optional[int] = None

@dataclass 
class Member:
    displayName: str = ""
    profile: str = ""

@dataclass
class Team:
    position: int = 0
    members: list[Member] = field(default_factory=list[Member])
    scoreParts: ScoreParts = field(default_factory=ScoreParts)

@dataclass 
class BossLB:
    id: str = ""
    boss: str = ""
    totalScores: int = 0
    scoringType: str = ""
    teams: list[Team] = field(default_factory=list[Team])
