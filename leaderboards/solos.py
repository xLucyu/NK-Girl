from leaderboards.medals import getMedalForPosition 
from leaderboards.scores import determineLeaderboardScore 
from api.fetchid import getData
from api.emojis import getEmojis 

def formatSoloLeaderboard(urls, apiData, metaData, page, difficulty, lbType):
     
    leaderboardData = getData(f"{metaData}?page={page}")
    emojis = getEmojis()
 
    totalscores = apiData.get(urls.get("totalscores"), None)
    leaderboardCompetitionType = apiData.get("scoringType", "GameTime")

    lbBody = leaderboardData.get("body", None) 
    leaderboardEntriesPerPage = len(lbBody)
    maxNameLength = max(len(player.get("displayName", "").replace("(disbanded)", "").strip()) for player in lbBody) 

    playerData = str()
         
    for position, player in enumerate(lbBody, start=1):
 
        currentPosition = leaderboardEntriesPerPage * (page - 1) + position
        playerName = player.get("displayName", None)
        playerName = playerName.replace("(disbanded)", "").strip()
        medal = getMedalForPosition(emojis, currentPosition, totalscores, lbType, difficulty)
        formattedScore = determineLeaderboardScore(player, leaderboardCompetitionType, lbType) 

        playerData += f"{medal} `{currentPosition:02}` `{playerName.ljust(maxNameLength)} {str(formattedScore).rjust(10)}`\n"

    return playerData, totalscores
