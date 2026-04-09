from dataclasses import dataclass
from typing import Optional

@dataclass
class EventURLs:
    base: str 
    extension: Optional[dict[str, str]] | str = None 
    totalScores: Optional[str] = None

    def getExtension(self, eventId: str, difficulty: str | None = None) -> str:

        if isinstance(self.extension, dict):
            attribute = f"/{eventId}/{self.extension.get(difficulty.lower(), "")}"
        elif self.extension:
            attribute = f"/{eventId}/{self.extension}"
        else:
            attribute = ""

        return f"{self.base}{attribute}"


URLS: dict[str, EventURLs] = {

    "Boss": EventURLs(
        base = "https://data.ninjakiwi.com/btd6/bosses",
        extension = {
            "standard": "metadata/standard",
            "elite": "metadata/elite"
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
            "easy": "easy",
            "medium": "medium",
            "hard": "hard"
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

