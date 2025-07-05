from dataclasses import dataclass, field
from typing import List

@dataclass
class Body:
    id: str = ""
    name: str = ""
    start: int = 0
    end: int = 0
    # Race
    metadata: str = ""
    totalScores: int = 0
    leaderboard: str = ""
    # Boss
    bossType: str = ""
    metadataStandard: str = ""
    metadataElite: str = ""
    totalScores_standard: int = 0
    totalScores_elite: int = 0
    leaderboard_standard_players_1: str = ""
    leaderboard_elite_players_1: str = ""
    scoringType: str = ""
    normalScoringType: str = ""
    eliteScoringType: str = ""
    # CT
    totalScores_player: int = 0
    totalScores_team: int = 0
    leaderboard_player: str = ""
    leaderboard_team: str = ""
    # Odyssey
    metadata_easy: str = ""
    metadata_medium: str = ""
    metadata_hard: str = ""
    #challenge
    createdAt: int = 0

@dataclass
class NkData:
    success: bool = False
    body: List[Body] = field(default_factory=list)
