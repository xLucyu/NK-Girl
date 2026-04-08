from dataclasses import dataclass
from typing import Optional

@dataclass
class EventURLs:
    base: str 
    extension: Optional[dict[str, str]] | str = None 
    totalScores: Optional[str] = None

    def getExtension(self, difficulty: str | None = None) -> str:
        
        if not difficulty:
            return self.base 

        if isinstance(self.extension, dict):
            attr = self.extension.get(difficulty.lower())
        else:
            attr = self.extension

        return f"{self.base}/{attr}"


URLS: dict[str, EventURLs] = {

    "Boss": EventURLs(
        base = "https://data.ninjakiwi.com/btd6/bosses",
        extension = {
            "standard": "metadataStandard",
            "elite": "metaDataElite"
        },
        totalScores = "totalScores_{}"
    ),
    "Race": EventURLs(
        base = "https://data.ninjakiwi.com/btd6/races",
        extension = "metadata",
        totalScores = "totalScores"
    ),
    "Odyssey": EventURLs(
        base = "https://data.ninjakiwi.com/btd6/odyssey",
        extension = {
            "easy": "metadata_easy",
            "medium": "metadata_medium",
            "hard": "metadata_hard"
        }
    ),
    "CT": EventURLs(
        base = "https://data.ninjakiwi.com/btd6/ct",
        totalScores = "totalScores_{}"
    ),
    "Tile": EventURLs(
        base = "https://storage.googleapis.com/btd6-ct-map/events",
        extension = "{}/tiles.json"
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
    ),
    "Emojis": EventURLs(
        base = "https://discord.com/api/v10/applications/{}/emojis"
    ),
    "Events": EventURLs(
        base = "https://data.ninjakiwi.com/btd6/events"
    )
}

