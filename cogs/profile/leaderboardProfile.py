import discord
from leaderboards.formatLeaderboards import FormatLeaderboards
from utils.dataclasses.main import Body
from cogs.baseCommand import BaseCommand

def getTotalScoreKey(mainData: Body, difficulty: str) -> int:

    match difficulty:

        case "Team":
            return mainData.totalScores_team
        
        case "Player":
            return mainData.totalScores_player
        
        case _:
            return mainData.totalScores
        
    return 0


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
    data = BaseCommand.getCurrentEventData(urls, index=0)
    apiData = data.get("Data", {})
    mainData = BaseCommand.transformDataToDataClass(Body, apiData) 
    metaData = data.get("MetaData")
    emojis = BaseCommand.getAllEmojis()

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
    embed.set_footer(text=f"Total Entries: {totalScores}\nTime Left: {leaderboard.timeLeftForLeaderboard(mainData.end)}")

    return embed
