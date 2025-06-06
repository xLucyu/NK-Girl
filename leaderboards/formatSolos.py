from leaderboards.base import BaseLeaderboard

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
     
        leaderboardData = self.getLeaderboardData(self.metaData, self.page) 
 
        totalScores = self.apiData.get(self.urls.get("totalscores"), None)
        leaderboardCompetitionType = self.apiData.get("scoringType", "GameTime")

        lbBody = leaderboardData.get("body", None) 
        leaderboardEntriesPerPage = len(lbBody)
        maxNameLength = max(len(player.get("displayName", "").replace("(disbanded)", "").strip()) for player in lbBody) 

        playerData = str()
         
        for position, player in enumerate(lbBody, start=1):
 
            currentPosition = leaderboardEntriesPerPage * (self.page - 1) + position
            playerName = player.get("displayName", None)
            playerName = playerName.replace("(disbanded)", "").strip()

            medal = self.getMedalforPosition(self.emojis, currentPosition, totalScores, self.lbType, self.difficulty)
            formattedScore = self.determineLeaderboardScore(leaderboardCompetitionType, player) 

            playerData += f"{medal} `{currentPosition:02}` `{playerName.ljust(maxNameLength)} {str(formattedScore).rjust(10)}`\n"

        return playerData, totalScores
    
    def determineLeaderboardScore(self, leaderboardCompetitionType, player):
    
        currentPlayerScore = player.get("score", None)
        return self.convertMsToTime(currentPlayerScore) if leaderboardCompetitionType == "GameTime" and self.lbType != "ct" else currentPlayerScore   
