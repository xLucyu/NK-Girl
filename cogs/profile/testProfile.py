import discord
from api.fetchid import getID, getData
from api.emojis import getEmojis

def getMedalForPosition(emojis, currentPosition, totalScores, lbType, difficulty):

    top1Percent = totalScores * 0.01
    top10Percent = totalScores * 0.10
    top25Percent = totalScores * 0.25
    top50Percent = totalScores * 0.5 
    top75Percent = totalScores * 0.75

    isElite = "E" if difficulty == "elite" else ""

    medals = {
        "race": {
            (1,1): f"<:RaceFirst:{emojis.get('RaceFirst')}>",
            (2,2): f"<:RaceSecond:{emojis.get('RaceSecond')}>", 
            (3,3): f"<:RaceThird:{emojis.get('RaceThird')}>",
            (4,50): f"<:RaceT50:{emojis.get('RaceT50')}>",
            (51, top1Percent): f"<:RaceT1Perc:{emojis.get('RaceT1Perc')}>",
            (top1Percent, top10Percent): f"<:RaceT10Perc:{emojis.get('RaceT10Perc')}>",
            (top10Percent, top25Percent): f"<:RaceT25Perc:{emojis.get('RaceT25Perc')}>",
            (top25Percent, top50Percent): f"<:RaceT50Perc:{emojis.get('RaceT50Perc')}>",
            (top50Percent, top75Percent): f"<:RaceT75Perc:{emojis.get('RaceT75Perc')}>"
        },
        "boss": {
            (1,1): f"<:Boss{isElite}First:{emojis.get(f'Boss{isElite}First')}>",
            (2,2): f"<:Boss{isElite}Second:{emojis.get(f'Boss{isElite}Second')}>", 
            (3,3): f"<:Boss{isElite}Third:{emojis.get(f'Boss{isElite}Third')}>",
            (4,50): f"<:Boss{isElite}T50:{emojis.get(f'Boss{isElite}T50')}>",
            (51, top1Percent): f"<:Boss{isElite}T1Perc:{emojis.get(f'Boss{isElite}T1Perc')}>",
            (top1Percent, top10Percent): f"<:Boss{isElite}T10Perc:{emojis.get(f'Boss{isElite}T10Perc')}>",
            (top10Percent, top25Percent): f"<:Boss{isElite}T25Perc:{emojis.get(f'Boss{isElite}T25Perc')}>",
            (top25Percent, top50Percent): f"<:Boss{isElite}T50Perc:{emojis.get(f'Boss{isElite}T50Perc')}>",
            (top50Percent, top75Percent): f"<:Boss{isElite}T75Perc:{emojis.get(f'Boss{isElite}T75Perc')}>"
        },
        "ct": {
            "player": {
                (1,25): f"<:CTPT25:{emojis.get('CTPT25')}>",
                (26,100): f"<:CTPT100:{emojis.get('CTPT100')}>",
                (101, top1Percent): f"<:CTPT1Perc:{emojis.get('CTPT1Perc')}>",
                (top1Percent, top10Percent): f"<:CTPT10Perc:{emojis.get('CTPT10Perc')}>",
                (top10Percent, top25Percent): f"<CTPT25Perc:{emojis.get('CTPT25Perc')}>",
                (top25Percent, top50Percent): f"<CTPT50Perc:{emojis.get('CTPT50Perc')}>",
                (top50Percent, top75Percent): f"<CTPT75Perc:{emojis.get('CTPT75Perc')}>"
            },
            "team": {
                (1,1): f"<:CTTFirst:{emojis.get('CTTFirst')}>",
                (2,2): f"<:CTTSecond:{emojis.get('CTTSecond')}>", 
                (3,3): f"<:CTTThird:{emojis.get('CTTThird')}>",
                (4, 25): f"<:CTTT25:{emojis.get('CTTT25')}>",
                (26,100): f"<:CTTT100:{emojis.get('CTTT100')}>",
                (101, top1Percent): f"<:CTTT1Perc:{emojis.get('CTTT1Perc')}>",
                (top1Percent, top10Percent): f"<:CTTT10Perc:{emojis.get('CTTT10Perc')}>",
                (top10Percent, top25Percent): f"<:CTTT25Perc:{emojis.get('CTTT25Perc')}>",
                (top25Percent, top75Percent): f"<:CTTT75Perc:{emojis.get('CTTT75Perc')}>"
            }
        } 
    }
    
    if lbType != "ct":
        gamemode = medals.get(lbType, None)
    else:
        gamemode= medals.get(lbType, None).get(difficulty, None)

    if not gamemode: 
        return None

    for position, medal in gamemode.items(): 
        if position[0] <= currentPosition <= position[1]:
            return medal

def getLeaderboardData(urls: dict, page: int):
    
    api = getID(urls, index=1) 

    if not api:
        return None
    
    leaderboardData = getData(f"{api.get('MetaData', None)}?page={page}")
    emojis = getEmojis()
         

    return api, leaderboardData, emojis

def testProfile(lbType, page, difficulty=None, players=None):
    
    leaderboardUrls = {
        "race": {
            "base": "https://data.ninjakiwi.com/btd6/races",
            "extension": f"leaderboard",
            "totalscores": "totalScores"
        },
        "boss": {
            "base": "https://data.ninjakiwi.com/btd6/bosses",
            "extension": f"leaderboard_{difficulty}_players_{players}", 
            "totalscores": f"totalScores_{difficulty}"
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

    api, leaderboardData, emojis = getLeaderboardData(urls, page) #type: ignore
    
    apiData = api.get("Data", None)
    totalscores = apiData.get(urls.get("totalscores"), None) 
    lbBody = leaderboardData.get("body", None)
    leaderboardEntriesPerPage = len(lbBody)
    playerData = str()
    maxNameLength = max(len(player.get("displayName", "").replace("(disbanded)", "").strip()) for player in lbBody)
    
    for position, player in enumerate(lbBody, start=1):
 
        currentPosition = leaderboardEntriesPerPage * (page - 1) + position
        playerName = player.get("displayName", None)
        playerName = playerName.replace("(disbanded)", "").strip()
        score = player.get("score", None)
        medal = getMedalForPosition(emojis, currentPosition, totalscores, lbType, difficulty)
        playerData += f"{medal} `{currentPosition:02}` `{playerName.ljust(maxNameLength)} {score}`\n"

    embed = discord.Embed(title="Leaderboard", description=playerData, color=discord.Color.blue())
    return embed
