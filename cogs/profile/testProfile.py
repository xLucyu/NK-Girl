import discord
from api.fetchid import getID, getData
from api.emojis import getEmojis


def convertMsToTime(score):

    hours = (score // (1000 * 60 * 60)) 
    minutes = (score // (1000 * 60)) % 60
    seconds = (score // 1000) % 60
    milliseconds = score % 1000

    return (f"{hours}:" if hours >= 1 else "") + f"{minutes:02}:{seconds:02}.{milliseconds:03}"   


def determineLeaderboardScore(player, leaderboardCompetitionType):
    
    if leaderboardCompetitionType == "GameTime":
        score = player.get("score", None)
        formattedScore = convertMsToTime(score)
    else:
        firstScore = player["scoreParts"][0]["score"]
        secondScore = player["scoreParts"][1]["score"]

        firstScore = f"${firstScore:,}" if leaderboardCompetitionType == "LeastCash" else firstScore
        formattedScore = f"{firstScore} ({convertMsToTime(secondScore)})"

    return formattedScore


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
    
    metaData = api.get("MetaData", None)
    leaderboardData = getData(f"{metaData}?page={page}")
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
            "extension": f"leaderboard_{difficulty}_players_1", 
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
    
    if players == 1 or players is None:

        api, leaderboardData, emojis = getLeaderboardData(urls, page) #type: ignore
        apiData = api.get("Data", None)
        totalscores = apiData.get(urls.get("totalscores"), None) 
        lbBody = leaderboardData.get("body", None) 
        leaderboardEntriesPerPage = len(lbBody)
        playerData = str()
        maxNameLength = max(len(player.get("displayName", "").replace("(disbanded)", "").strip()) for player in lbBody)
        leaderboardCompetitionType = apiData.get("scoringType", None)


        for position, player in enumerate(lbBody, start=1):
 
            currentPosition = leaderboardEntriesPerPage * (page - 1) + position
            playerName = player.get("displayName", None)
            playerName = playerName.replace("(disbanded)", "").strip()
            medal = getMedalForPosition(emojis, currentPosition, totalscores, lbType, difficulty)
            formattedScore = determineLeaderboardScore(player, leaderboardCompetitionType) 

            playerData += f"{medal} `{currentPosition:02}` `{playerName.ljust(maxNameLength)} {str(formattedScore).rjust(10)}`\n"

    else:

        api = getID(urls, index=0)  
        if not api:
            return None
        
        apiData = api.get("Data", None)
        leaderboardCompetitionType = apiData.get("scoringType", None)
        emojis = getEmojis()
        metaData = api.get("MetaData", None)
        base, _ = metaData.rsplit("/", 1)
        metaData = f"{base}/{players}"         
        players = dict()
        initialPage = 1

        while True:
            leaderboardData = getData(f"{metaData}?page={initialPage}")
            validPage = leaderboardData.get("success")

            if not validPage:
                break
            
            lbBody = leaderboardData.get("body", None)
            
            for player in lbBody:
                
                playerName = player.get("displayName")
                initialScore = determineLeaderboardScore(player, leaderboardCompetitionType) 
                teamScore = player["scoreParts"][1]["score"]
                
                if teamScore in players:
                    players[teamScore].append(playerName)
                else:
                    players[teamScore] = [initialScore, playerName] 
 
            initialPage += 1
        
        page = 1
        totalscores = len(players)
        playerData = str()
        teamsLength = {key: sum(len(player) for player in value[1:]) for key, value in players.items()} 
        maxTeamLength = max(teamsLength.values())
        
        items = list(players.items())
        startIndex = (page - 1) * 25 + 1
        endIndex = startIndex + 24 

        for position, (_, player) in enumerate(items[startIndex-1:endIndex], start=startIndex):
           
            teamScore = player[0]
            players = ", ".join(player[1:])
            currentPosition = position 
            
            medal = getMedalForPosition(emojis, currentPosition, totalscores, lbType, difficulty)
            playerData += f"{medal} `{currentPosition:02}` `{players.ljust(maxTeamLength)} {str(teamScore).rjust(10)}`\n"
            
         

    embed = discord.Embed(title="Leaderboard", description=playerData, color=discord.Color.blue())
    return embed
