import discord 
from leaderboards.formatSolos import SoloLeaderboard
from leaderboards.formatBossLeaderboard import BossLeaderboard
from leaderboards.eventInfo import formatEventInfo
from api.fetchId import getID
from api.emojis import getEmojis


def leaderboardProfile(lbType, page, difficulty=None, players=None, teamScores=None):

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

    urls = leaderboardUrls.get(lbType, None)
    if not urls:
        return None

    api = getID(urls, index=0)
    if not api:
        return None

    apiData = api.get("Data", None)
    metaData = api.get("MetaData", None)
    emojis = getEmojis()
    
    if lbType != "boss":
        leaderboard = SoloLeaderboard(urls, apiData, metaData, page, difficulty, lbType, emojis)
        playerData, totalScores = leaderboard.formatLeaderboard()
    else:
        leaderboard = BossLeaderboard(urls, apiData, metaData, emojis, page, difficulty, lbType, players)
        if players > 1:
            if not teamScores:
                teamScores = leaderboard.getMultiplayerLeaderboard()
            playerData, totalScores = leaderboard.formatMultiplayerLeaderboard(teamScores)
        else:
            playerData, totalScores = leaderboard.formatLeaderboard()

    eventData = formatEventInfo(apiData, lbType, difficulty)
    embed = discord.Embed(title=eventData, description=playerData, color=discord.Color.blue())
    embed.set_footer(text=f"Total Entries: {totalScores}")

    return embed, teamScores
