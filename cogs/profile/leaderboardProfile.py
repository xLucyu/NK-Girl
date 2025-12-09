import discord 
from leaderboards.formatLeaderboards import FormatLeaderboards
from utils.dataclasses.main import Body
from cogs.baseCommand import BaseCommand


def leaderboardProfile(lbType, page, difficulty="", players=None, teamScores=None, scoreType=None):

    leaderboardUrls = {
        "race": {
            "base": "https://data.ninjakiwi.com/btd6/races",
            "extension": "leaderboard"
        },
        "boss": {
            "base": "https://data.ninjakiwi.com/btd6/bosses",
            "extension": f"leaderboard_{difficulty}_players_1",  
        },
        "ct": {
            "base": "https://data.ninjakiwi.com/btd6/ct",
            "extension": f"leaderboard_{difficulty}"
        }
    } 

    urls = leaderboardUrls.get(lbType, {})
    data = BaseCommand.getCurrentEventData(urls, index=0)
    apiData = data.get("Data", {})
    mainData = BaseCommand.transformDataToDataClass(Body, apiData) 
    metaData = data.get("MetaData", None)
    emojis = BaseCommand.getAllEmojis()
    
    if lbType != "boss":

        leaderboard = FormatLeaderboards(
            urls=urls, 
            apiData=apiData, 
            metaData=metaData, 
            emojis=emojis, 
            page=page, 
            difficulty=difficulty, 
            lbType=lbType, 
            players=1, 
            leaderboardCompetitionType="")

        playerData = leaderboard.formatLeaderboard()

    else:

        scoreTypeKey = mainData.eliteScoringType if difficulty.lower() == "elite" else mainData.normalScoringType
        leaderboard = FormatLeaderboards(
            urls=urls, 
            apiData=apiData,
            metaData=metaData,
            emojis=emojis,
            page=page,
            difficulty=difficulty,
            lbType=lbType,
            players=players,
            leaderboardCompetitionType=scoreTypeKey
        )

    eventEnd = mainData.end
    timeLeft = leaderboard.timeLeftForLeaderboard(eventEnd)
    eventData = leaderboard.formatEventInfo(mainData, lbType, difficulty)
    embed = discord.Embed(title=f"{eventData}, page {page}", description=playerData, color=discord.Color.green())
    embed.set_footer(text=f"Total Entries: {totalScores}\nTime Left: {timeLeft}")

    return {
        "Embed": embed, 
        "TeamScores": teamScores,
        "TotalScores": mainData.totalScores,
        "ScoreType": scoreType,
        "LeaderboardURL": metaData 
    } 
