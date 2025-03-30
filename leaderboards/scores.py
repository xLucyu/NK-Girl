def convertMsToTime(score):

    hours = (score // (1000 * 60 * 60)) 
    minutes = (score // (1000 * 60)) % 60
    seconds = (score // 1000) % 60
    milliseconds = score % 1000

    return (f"{hours}:" if hours >= 1 else "") + f"{minutes:02}:{seconds:02}.{milliseconds:03}"   

def determineLeaderboardScore(player, leaderboardCompetitionType, lbType):
    
    if leaderboardCompetitionType not in ["LeastCash", "LeastTiers"]:
        score = player.get("score", None)
        formattedScore = convertMsToTime(score) if leaderboardCompetitionType == "GameTime" and lbType != "ct" else score
    else:
        firstScore = player["scoreParts"][0]["score"]
        secondScore = player["scoreParts"][1]["score"]

        firstScore = f"${firstScore:,}" if leaderboardCompetitionType == "LeastCash" else firstScore
        firstScore = f"{firstScore}T" if leaderboardCompetitionType == "LeastTiers" else firstScore

        formattedScore = f"{firstScore} ({convertMsToTime(secondScore)})"

    return formattedScore
