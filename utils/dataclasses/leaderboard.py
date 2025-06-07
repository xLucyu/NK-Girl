from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class ScoreParts:
    type: str = "" 
    score: int = 0
    name: str = ""

@dataclass
class Body:
    displayName: str = ""
    score: int = 0
    scoreParts: List[ScoreParts] = field(default_factory=list)
    submissionTime: int = -1
    profile: str = "" 

@dataclass
class Leaderboard:
    success: bool = True
    body: List[Body] = field(default_factory=list)
    next: Optional[str] = ""
    prev: Optional[str] = ""
