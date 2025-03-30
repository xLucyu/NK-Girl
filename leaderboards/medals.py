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
            (top50Percent, top75Percent): f"<:RaceT75Perc:{emojis.get('RaceT75Perc')}>",
            (top75Percent, totalScores): f"<:Participant:{emojis.get('Participant')}>"
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
            (top50Percent, top75Percent): f"<:Boss{isElite}T75Perc:{emojis.get(f'Boss{isElite}T75Perc')}>",
            (top75Percent, totalScores): f"<:Participant:{emojis.get('Participant')}>"
        },
        "ct": {
            "player": {
                (1,25): f"<:CTPT25:{emojis.get('CTPT25')}>",
                (26,100): f"<:CTPT100:{emojis.get('CTPT100')}>",
                (101, top1Percent): f"<:CTPT1Perc:{emojis.get('CTPT1Perc')}>",
                (top1Percent, top10Percent): f"<:CTPT10Perc:{emojis.get('CTPT10Perc')}>",
                (top10Percent, top25Percent): f"<CTPT25Perc:{emojis.get('CTPT25Perc')}>",
                (top25Percent, top50Percent): f"<CTPT50Perc:{emojis.get('CTPT50Perc')}>",
                (top50Percent, top75Percent): f"<CTPT75Perc:{emojis.get('CTPT75Perc')}>",
                (top75Percent, totalScores): f"<:Participant:{emojis.get('Participant')}>"
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
                (top25Percent, top75Percent): f"<:CTTT75Perc:{emojis.get('CTTT75Perc')}>",
                (top75Percent, totalScores): f"<:Participant:{emojis.get('Participant')}>"
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
