from leaderboards.base import BaseLeaderboard
from utils.dataclasses.leaderboard import Leaderboard, Body 
from cogs.baseCommand import BaseCommand
from utils.assets.medals import MEDALS

class BossLeaderboard(BaseLeaderboard):
    def __init__(self, 
                 urls: dict, 
                 apiData: dict, 
                 metaData: dict, 
                 emojis: dict, 
                 page: int, 
                 difficulty: str, 
                 lbType: str, 
                 players: int) -> None:
        super().__init__() 
        self.urls = urls
        self.apiData = apiData
        self.metaData = metaData
        self.emojis = emojis 
        self.page = page
        self.difficulty = difficulty
        self.lbType = lbType
        self.players = players  
    
    @staticmethod
    def fetchTeamScore(player: Body): 
        scoreParts = player.scoreParts
    
        return [
            score.score 
            for score in scoreParts[:-1] #filter out submission time
        ]

    def getMultiplayerLeaderboard(self):
        
        base, _ = self.metaData.rsplit("/", 1)
        metaData = f"{base}/{self.players}"         
        teamScores = dict()
        initialPage = 1

        while True:
            leaderboardData = self.getLeaderboardData(metaData, initialPage)
            leaderboardData = BaseCommand.transformDataToDataClass(Leaderboard, leaderboardData)

            if not leaderboardData.success:
                break
            
            lbBody = leaderboardData.body  
            leaderboardCompetitionType = lbBody[0].scoreParts[1].name

            for player in lbBody:    
                playerName = player.displayName
                initialScore = self.determineLeaderboardScore(leaderboardCompetitionType, player) 
                teamScore = tuple(self.fetchTeamScore(player))
                
                if teamScore in teamScores:
                    teamScores[teamScore].append(playerName)
                else:
                    teamScores[teamScore] = [initialScore, playerName] 
        
            initialPage += 1 

        return teamScores

    def determineLeaderboardScore(self, leaderboardCompetitionType: str, player: Body):
        
        currentPlayerScore = player.scoreParts[1].score  

        match leaderboardCompetitionType:
            case "Game Time":
                formattedScore = self.convertMsToTime(currentPlayerScore)
                
            case "Tier Count":
                secondScore = player.scoreParts[2].score
                formattedScore = f"{currentPlayerScore}T ({self.convertMsToTime(secondScore)})" 

            case "Least Cash":
                secondScore = player.scoreParts[2].score
                formattedScore = f"${currentPlayerScore:,} ({self.convertMsToTime(secondScore)})"

            case _:
                formattedScore = None

        return formattedScore

    def formatLeaderboard(self): 

        data = self.getLeaderboardData(self.metaData, self.page)
        leaderboardData = BaseCommand.transformDataToDataClass(Leaderboard, data) 
        totalScores = self.apiData.get(self.urls.get("totalscores"), None) 

        lbBody = leaderboardData.body   
        leaderboardCompetitionType = lbBody[0].scoreParts[1].name  
        leaderboardEntriesPerPage = len(lbBody)
        maxNameLength = max(len(player.displayName.strip()) for player in lbBody)
        mode = MEDALS.get(self.difficulty, {})
        bossTiersMedal = f"<:{self.emojis.get("BossTiers")}:BossTiers>"

        playerData = str() 

        for position, player in enumerate(lbBody, start=1): 
            currentPosition = leaderboardEntriesPerPage * (self.page - 1) + position
            playerName = player.displayName
            
            bossTiers = player.scoreParts[0].score
            medal = self.getMedalForPosition(self.emojis, currentPosition, totalScores, mode)
            formattedScore = self.determineLeaderboardScore(leaderboardCompetitionType, player) 

            playerData += f"{medal}`{currentPosition:02}` {bossTiersMedal} `{bossTiers}` `{playerName.ljust(maxNameLength)} {str(formattedScore).rjust(10)}`\n"

        return playerData, totalScores
    
    def formatMultiplayerLeaderboard(self, teamScores: dict): 
        totalScores = len(teamScores)
        playerData = str() 

        items = list(teamScores.items())
        startIndex = (self.page - 1) * 25
        endIndex = startIndex + 25
        mode = MEDALS.get(self.difficulty, {})
        bossTiersMedal = f"<:{self.emojis.get("BossTiers")}:BossTiers>"

        for position, (scores, player) in enumerate(items[startIndex:endIndex], start=startIndex + 1):      
            teamScore = player[0]
            teamMembers = ", ".join(player[1:])
            currentPosition = position 
            bossTiers = scores[0] 
        
            medal = self.getMedalForPosition(self.emojis, currentPosition, totalScores, mode)
            playerData += f"{medal} `{currentPosition:02}` {bossTiersMedal} `{bossTiers}` `{teamMembers:<42} {teamScore:>5}`\n"
    
        return playerData, totalScores
