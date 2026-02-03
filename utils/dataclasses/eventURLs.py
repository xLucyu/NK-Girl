from dataclasses import dataclass
from typing import Optional

@dataclass
class EventURLs:
    base: str 
    extension: Optional[str] = None 
    totalScores: Optional[str] = None


URLS: dict[str, EventURLs] = {
    "Boss": EventURLs(
        base = "https://data.ninjakiwi.com/btd6/bosses",
        extension = "metadata{}",
        totalScores = "totalScores{}"
    ),
    "Race": EventURLs(
        base = "https://data.ninjakiwi.com/btd6/races",
        extension = "metadata",
        totalScores = "totalScores"
    ),
    "Odyssey": EventURLs(
        base = "https://data.ninjakiwi.com/btd6/odyssey",
        extension = "metadata{}"
    ),
    "CT": EventURLs(
        base = "https://data.ninjakiwi.com/btd6/ct",
        totalScores = "totalScores{}"
    ),
    "Tile": EventURLs(
        base = "https://storage.googleapis.com/btd6-ct-map/events",
        extensions =  "{}/tiles.json"
    ),
    "BossLB": EventURLs(
        base = "https://storage.googleapis.com/btd6_boss_leaderboard/{}/{}/{}/leaderboard.json"
    ),
    "Challenge": EventURLs(
        base = "https://data.ninjakiwi.com/btd6/challenges/challenge/{}"
    ),
    "ChallengeDaily": EventURLs(
        base = "https://data.ninjakiwi.com/btd6/challenges/filter/daily",
        extension = "metadata"
    )
}
