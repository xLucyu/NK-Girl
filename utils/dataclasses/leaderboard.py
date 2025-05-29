from dataclasses import dataclass
from typing import Optional

@dataclass
class ScoreParts:
    type: Optional[str] = None
    score: Optional[int] = None
    name: Optional[str] = None

@dataclass
class Body:
    displayName: Optional[str] = None
    score: Optional[int] = None
    scoreParts: Optional[ScoreParts] = None

@dataclass
class Leaderboard:
    success: Optional[bool] = None
    body: Optional[Body] = None
    submissionTime: Optional[int] = None
    profile: Optional[str] = None
