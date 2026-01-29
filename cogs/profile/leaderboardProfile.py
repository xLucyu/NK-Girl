import discord
from leaderboards.formatLeaderboards import FormatLeaderboards
from utils.dataclasses.main import Body
from cogs.baseCommand import BaseCommand

def getTotalScoreKey(mainData: Body, difficulty: str) -> int:

    match difficulty:

        case "team":
            return mainData.totalScores_team
        
        case "player":
            return mainData.totalScores_player
        
        case _:
            return mainData.totalScores
        

def leaderboardProfile(lbType, page, difficulty="", players=None):

    leaderboardUrls = {
        "Race": {
            "base": "https://data.ninjakiwi.com/btd6/races",
            "extension": "leaderboard",
            "TotalScores": "totalScores"
        },
        "Boss": {
            "base": "https://data.ninjakiwi.com/btd6/bosses", 
            "TotalScores": f"totalScores_{difficulty}"
        },
        "CT": {
            "base": "https://data.ninjakiwi.com/btd6/ct",
            "extension": f"leaderboard_{difficulty}",
            "TotalScores": f"totalScores_{difficulty}"
        }
    } 

    urls = leaderboardUrls.get(lbType, {})
    data = BaseCommand.getCurrentEventData(urls, index=0) #index=0 doesnt matter in this case
    apiData = data.get("Data", {})
    mainData = BaseCommand.transformDataToDataClass(Body, apiData) 
    metaData = data.get("MetaData", None)
    emojis = BaseCommand.getAllEmojis()

    if lbType == "Boss":
        metaData = f"https://storage.googleapis.com/btd6_boss_leaderboard/{mainData.id}/{difficulty}/{players}/leaderboard.json"

    leaderboard = FormatLeaderboards(
        url = metaData,
        lbType = lbType,
        difficulty = difficulty,
        page = page,
        emojis = emojis,
        totalScores = getTotalScoreKey(mainData, difficulty)
    )
    
    playerData, totalScores = leaderboard.handleFormatting()
    title = leaderboard.formatEventInfo(mainData, lbType, difficulty)
    embed = discord.Embed(title=f"{title}, page {page}", description = playerData, color = discord.Color.green())
    embed.set_footer(text=f"Total Entries: {totalScores}\nTime Left: {leaderboard.timeLeftForLeaderboard(mainData.end)} \n*It might take up to 30 minutes for the leaderboard to update.")

    return {
        "Embed": embed,
        "LeaderboardURL": metaData,
        "TotalScores": totalScores
    }
