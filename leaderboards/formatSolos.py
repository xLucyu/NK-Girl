from leaderboards.base import BaseLeaderboard
from utils.dataclasses.leaderboard import Leaderboard, Body
from cogs.baseCommand import BaseCommand
from utils.assets.medals import MEDALS

class SoloLeaderboard(BaseLeaderboard):

    def __init__(self,
                 urls: dict,
                 apiData: dict,
                 metaData: dict,
                 page: int,
                 difficulty: str,
                 lbType: str, 
                 emojis: dict) -> None:
        super().__init__()
        self.urls = urls
        self.apiData = apiData
        self.metaData = metaData
        self.page = page 
        self.difficulty = difficulty 
        self.lbType = lbType
        self.emojis = emojis

    def formatLeaderboard(self):
     
        data = self.getLeaderboardData(self.metaData, self.page)
        leaderboardData = BaseCommand.transformDataToDataClass(Leaderboard, data)
 
        totalScores = self.apiData.get(self.urls.get("totalscores"), None)
        leaderboardCompetitionType = self.apiData.get("scoringType", "GameTime")

        lbBody = leaderboardData.body 
        leaderboardEntriesPerPage = 50 if self.lbType == "race" else 25
        maxNameLength = max(len(player.displayName.replace("(disbanded)", "").strip()) for player in lbBody) 

        playerData = str()
        mode = MEDALS[f"{self.lbType}{self.difficulty}"] if self.lbType != "race" else MEDALS[self.lbType] # deal with it  
         
        for position, player in enumerate(lbBody, start=1):
            currentPosition = leaderboardEntriesPerPage * (self.page - 1) + position
            playerName = player.displayName
            playerName = playerName.replace("(disbanded)", "").strip()

            medal = self.getMedalForPosition(self.emojis, currentPosition, totalScores, mode)
            formattedScore = self.determineLeaderboardScore(leaderboardCompetitionType, player) 

            playerData += f"{medal} `{currentPosition:02}` `{playerName.ljust(maxNameLength)} {str(formattedScore).rjust(10)}`\n"

        return playerData, totalScores
    
    def determineLeaderboardScore(self, leaderboardCompetitionType: str, player: Body) -> int | str:
    
        currentPlayerScore = player.score

        if leaderboardCompetitionType == "GameTime" and self.lbType != "ct":
            return self.convertMsToTime(currentPlayerScore)
        else:
            return currentPlayerScore 
