from dataclasses import dataclass
from typing import Optional

@dataclass
class EventURLs:
    base: str 
    extension: Optional[dict[str, str]] | str = None 
    totalScores: Optional[str] = None


    def getExtensionAttribute(self, object, difficulty: str) -> str | None:
        
        if not self.extension:
            return 

        if isinstance(self.extension, dict):
            attributeName = self.extension.get(difficulty, None)

            if not attributeName:
                return

        else: 
            attributeName = self.extension

        return getattr(object, attributeName)


URLS: dict[str, EventURLs] = {

    "Boss": EventURLs(
        base = "https://data.ninjakiwi.com/btd6/bosses",
        extension = {
            "Standard": "metadataStandard",
            "Elite": "metaDataElite"
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
