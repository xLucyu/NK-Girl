import discord
from leaderboards.formatSolos import SoloLeaderboard
from leaderboards.formatBossLeaderboard import BossLeaderboard 
from utils.dataclasses.main import Body
from cogs.baseCommand import BaseCommand


def leaderboardProfile(lbType, page, difficulty="", players=None, teamScores=None, scoreType=None):

    leaderboardUrls = {
        "race": {
            "base": "https://data.ninjakiwi.com/btd6/races",
            "extension": "leaderboard",
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

    urls = leaderboardUrls.get(lbType, {})
    data = BaseCommand.getCurrentEventData(urls, index=0)
    apiData = data.get("Data", {})
    mainData = BaseCommand.transformDataToDataClass(Body, apiData) 
    metaData = data.get("MetaData", None)
    emojis = BaseCommand.getAllEmojis()
    
    scoreTypeKey = "eliteScoringType" if difficulty.lower() == "elite" else "normalScoringType"
    leaderboardCompetitionType = getattr(mainData, scoreTypeKey)

    print(leaderboardCompetitionType)

    
    if lbType != "boss":
        leaderboard = SoloLeaderboard(urls, apiData, metaData, page, difficulty, lbType, emojis)
        playerData, totalScores = leaderboard.formatLeaderboard() 
    else:
        leaderboard = BossLeaderboard(urls, apiData, metaData, emojis, page, difficulty, lbType, players, leaderboardCompetitionType)
        if players > 1:
            if not teamScores:
                teamScores = leaderboard.getMultiplayerLeaderboard()
            playerData, totalScores = leaderboard.formatMultiplayerLeaderboard(teamScores)
        else:
            playerData, totalScores = leaderboard.formatBossLeaderboard() 

    eventEnd = mainData.end
    timeLeft = leaderboard.timeLeftForLeaderboard(eventEnd)
    eventData = leaderboard.formatEventInfo(mainData, lbType, difficulty)
    embed = discord.Embed(title=f"{eventData}, page {page}", description=playerData, color=discord.Color.green())
    embed.set_footer(text=f"Total Entries: {totalScores}\nTime Left: {timeLeft}")

    return {
        "Embed": embed, 
        "TeamScores": teamScores,
        "TotalScores": totalScores,
        "ScoreType": scoreType,
        "LeaderboardURL": metaData 
    } 
