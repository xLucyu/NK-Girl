from dataclasses import dataclass, field  

@dataclass 
class ScoreParts:
    type: str = ""
    score: int = 0
    name: str = ""

@dataclass 
class Body:
    displayName: str = "" 
    score: int = 0
    scoreParts: ScoreParts = field(default_factory=ScoreParts) 

@dataclass 
class Leaderboard: 
    success: bool = True
    body: Body = field(default_factory=Body)
    submissionTime: int = -1
    profile: str = ""
