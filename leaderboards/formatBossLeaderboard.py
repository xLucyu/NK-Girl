from leaderboards.base import BaseLeaderboard

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
    def fetchTeamScore(player): 
        scoreParts = player.get("scoreParts", [])
    
        return [
            score.get("score")
            for score in scoreParts
            if score.get("name") != "Submission Time"
        ]

    def getMultiplayerLeaderboard(self):
        
        base, _ = self.metaData.rsplit("/", 1)
        metaData = f"{base}/{self.players}"         
        teamScores = dict()
        initialPage = 1

        while True:
            leaderboardData = self.getLeaderboardData(metaData, initialPage)

            if not leaderboardData.get("success"):
                break
            
            lbBody = leaderboardData.get("body", None)  
            leaderboardCompetitionType = lbBody[0]["scoreParts"][1]["name"]

            for player in lbBody:    
                playerName = player.get("displayName", "")
                initialScore = self.determineLeaderboardScore(leaderboardCompetitionType, player) 
                teamScore = tuple(self.fetchTeamScore(player))
                
                if teamScore in teamScores:
                    teamScores[teamScore].append(playerName)
                else:
                    teamScores[teamScore] = [initialScore, playerName] 
        
            initialPage += 1 

        return teamScores

    def determineLeaderboardScore(self, leaderboardCompetitionType: str, player: dict):
        
        currentPlayerScore = player["scoreParts"][1]["score"] 

        match leaderboardCompetitionType:
            case "Game Time":
                formattedScore = self.convertMsToTime(currentPlayerScore)
                
            case "Tier Count":
                secondScore = player["scoreParts"][2]["score"]
                formattedScore = f"{currentPlayerScore}T ({self.convertMsToTime(secondScore)})" 

            case "Least Cash":
                secondScore = player["scoreParts"][2]["score"]
                formattedScore = f"${currentPlayerScore:,} ({self.convertMsToTime(secondScore)})"

            case _:
                formattedScore = None

        return formattedScore

    def formatLeaderboard(self):

        leaderboardData = self.getLeaderboardData(self.metaData, self.page)
        totalScores = self.apiData.get(self.urls.get("totalscores"), None) 

        lbBody = leaderboardData.get("body", None)  
        leaderboardCompetitionType = lbBody[0]["scoreParts"][1]["name"] # elite isnt in api  
        leaderboardEntriesPerPage = len(lbBody)
        maxNameLength = max(len(player.get("displayName", "").strip()) for player in lbBody)

        playerData = str()

        for position, player in enumerate(lbBody, start=1):
 
            currentPosition = leaderboardEntriesPerPage * (self.page - 1) + position
            playerName = player.get("displayName", None)

            medal = self.getMedalforPosition(self.emojis, currentPosition, totalScores, self.lbType, self.difficulty)
            formattedScore = self.determineLeaderboardScore(leaderboardCompetitionType, player) 

            playerData += f"{medal} `{currentPosition:02}` `{playerName.ljust(maxNameLength)} {str(formattedScore).rjust(10)}`\n"

        return playerData, totalScores
    
    def formatMultiplayerLeaderboard(self, teamScores):
    
        totalScores = len(teamScores)
        playerData = str() 

        items = list(teamScores.items())
        startIndex = (self.page - 1) * 25
        endIndex = startIndex + 25 

        for position, (_, player) in enumerate(items[startIndex:endIndex], start=startIndex + 1):      
            teamScore = player[0]
            teamMembers = ", ".join(player[1:])
            currentPosition = position 
        
            medal = self.getMedalforPosition(self.emojis, currentPosition, totalScores, self.lbType, self.difficulty)
            playerData += f"{medal} `{currentPosition:02}` `{teamMembers:<42} {teamScore:>5}`\n"
    
        return playerData, totalScores
