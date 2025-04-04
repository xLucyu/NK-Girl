import discord 
from leaderboards.multiplayer import formatMultiplayerLeaderboard, getMultiplayerLeaderboard 
from leaderboards.formatTitle import formatEventInfo
from leaderboards.solos import formatSoloLeaderboard
from api.fetchid import getID
  
def leaderboardProfile(lbType, page, difficulty=None, players=None):
    
    leaderboardUrls = {
        "race": {
            "base": "https://data.ninjakiwi.com/btd6/races",
            "extension": f"leaderboard",
            "totalscores": "totalScores",
        },
        "boss": {
            "base": "https://data.ninjakiwi.com/btd6/bosses",
            "extension": f"leaderboard_{difficulty}_players_1", 
            "totalscores": f"totalScores_{difficulty}",
        },
        "ct": {
            "base": "https://data.ninjakiwi.com/btd6/ct",
            "extension": f"leaderboard_{difficulty}",
            "totalscores": f"totalScores_{difficulty}"
        }
    }     

    urls = leaderboardUrls.get(lbType, None)
   
    if not urls:
        return None
 
    api = getID(urls, index=1) 

    if not api:
        return None
        
    apiData = api.get("Data", None)
    metaData = api.get("MetaData", None) 
    
    if players == 1 or players is None:
        playerData, totalscores = formatSoloLeaderboard(urls, apiData, metaData, page, difficulty, lbType) 
        teamScores = None

    else:
        teamScores = getMultiplayerLeaderboard(apiData, metaData, players, lbType)
        playerData, totalscores = formatMultiplayerLeaderboard(teamScores, page, lbType, difficulty) 
            
     
    eventData = formatEventInfo(apiData, lbType, difficulty) 
    embed = discord.Embed(title=eventData, description=playerData, color=discord.Color.blue())
    embed.set_footer(text=f"Total Entires: {totalscores}") 

    return embed, teamScores, eventData
