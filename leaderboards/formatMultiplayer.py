from api.fetchId import getData
from api.emojis import getEmojis
from leaderboards.defineScoreType import determineLeaderboardScore
from leaderboards.getMedals import getMedalForPosition

def getMultiplayerLeaderboard(apiData, metaData, players, lbType): 

    leaderboardCompetitionType = apiData.get("scoringType", None) 

    base, _ = metaData.rsplit("/", 1)
    metaData = f"{base}/{players}"         
    teamScores = dict()
    initialPage = 1

    while True:

        leaderboardData = getData(f"{metaData}?page={initialPage}")
        validPage = leaderboardData.get("success")

        if not validPage:
            break
            
        lbBody = leaderboardData.get("body", None)

        for player in lbBody:    
            playerName = player.get("displayName", "")
            initialScore = determineLeaderboardScore(player, leaderboardCompetitionType, lbType) 
            teamScore = player["scoreParts"][1]["score"]
                
            if teamScore in teamScores:
                teamScores[teamScore].append(playerName)
            else:
                teamScores[teamScore] = [initialScore, playerName] 
        
        initialPage += 1

    return teamScores


def formatMultiplayerLeaderboard(teamScores, page, lbType, difficulty):

    emojis = getEmojis()
    
    totalscores = len(teamScores)
    playerData = str() 

    items = list(teamScores.items())
    startIndex = (page - 1) * 25
    endIndex = startIndex + 25 

    for position, (_, player) in enumerate(items[startIndex:endIndex], start=startIndex + 1):      
        teamScore = player[0]
        teamMembers = ", ".join(player[1:])
        currentPosition = position 
        
        medal = getMedalForPosition(emojis, currentPosition, totalscores, lbType, difficulty)
        playerData += f"{medal} `{currentPosition:02}` `{teamMembers:<42} {teamScore:>5}`\n"

    
    return playerData, totalscores
