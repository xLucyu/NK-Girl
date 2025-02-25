from api.fetchid import getData


def getBody(url: str):
    
    Data = getData(url)
    
    if Data is None:
        return

    Body = Data.get("body", None)
        
    if Body is None:
        return

    return Body

def getMetaData(Body: dict) -> dict:  
    
    Stats = {
        "Mode": Body.get("mode", None),
        "Difficulty": Body.get("difficulty", None),
        "Lives": Body.get("lives", 0),
        "Cash": Body.get("startingCash", 0),
        "StartRound": Body.get("startRound", 0),
        "EndRound": Body.get("endRound", 0),
        "Towers": Body.get("_towers", None),
        "Map": Body.get("map", None),
        "Maps": Body.get("maps", None), 
        "Modifiers": {
                "Bloon_Modifiers": Body.get("_bloonModifiers", None),
                "MKDisabled": Body.get("disableMK", False),
                "NoSelling": Body.get("disableSelling", False),
                "AbilityCooldown": Body.get("abilityCooldownReductionMultiplier", 0),
                "RemovableCost": Body.get("removeableCostMultiplier", 0),
                "NoContinues": Body.get("noContinues", False),
                "MaxTowers": Body.get("maxTowers", 9999),
                "MaxParagons": Body.get("maxParagons", 9999),
                "LeastTiers": Body.get("leastTiersUsed", False),
                "LeastCash": Body.get("leastCashUsed", False),
                "PowersDisabled": Body.get("disabledPowers", False) 
            },
        "Odyssey": {
            "Extreme": Body.get("isExtreme", False),
            "MaxTowers": Body.get("maxMonkeySeats", 0),
            "MaxSlots": Body.get("maxMonkeysOnBoat", 0),
            "StartHealth": Body.get("startingHealth", 0),
            "AvailableTowers": Body.get("_availableTowers", None)
        },
        "CT": {
            "TileType": Body.get("TileType", None),
            "Relic": Body.get("RelicType", None),
            "GameData": Body.get("GameData", None)
        },
        "Challenge": {
            "Name": Body.get("name", None),
            "ID": Body.get("id", None),
            "Creator": Body.get("creator", None),
            "Wins": Body.get("wins", None),
            "Losses": Body.get("losses", None), 
            
        }
    }
 
    return Stats 
