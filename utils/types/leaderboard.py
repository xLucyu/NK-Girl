from dataclasses import dataclass 

@dataclass 
class ScoreParts:
    type: str 
    score: int 
    name: str 

@dataclass 
class Body:
    displayName: str 
    score: int 
    scoreParts: ScoreParts 

@dataclass 
class Leaderboard: 
    success: bool 
    body: Body
    submissionTime: int 
    profile: str 
