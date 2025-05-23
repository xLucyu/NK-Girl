from dataclasses import dataclass  

@dataclass
class Body:
    id: str 
    name: str  
    start: int
    end: int
    #Race 
    metadata: str
    totalScores: int 
    leaderboard: str 
    #Boss
    bossType: str 
    metadataStandard: str 
    metadataElite: str
    totalScores_standard: int 
    totalScores_elite: int
    leaderboard_standard_players_1: str  
    leaderboard_elite_players_1: str
    #CT 
    totalScores_player: int 
    totalScores_team: int
    leaderboard_player: str    
    leaderboard_team: str
    #Odyssey 
    metadata_easy: str  
    metadata_medium: str 
    metadata_hard: str


@dataclass 
class NkData:
    success: bool 
    body: Body
