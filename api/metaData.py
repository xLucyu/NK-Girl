from api.fetchId import getData


def getBody(url: str) -> dict | None:
    
    data = getData(url)
    
    if data is None:
        return

    body = data.get("body", None)

    if body is None:
        return

    return body

def getMetaData(body: dict) -> dict:  
    
    return {
        "Mode": body.get("mode", None),
        "Difficulty": body.get("difficulty", None),
        "Lives": body.get("lives", 0),
        "Cash": body.get("startingCash", 0),
        "StartRound": body.get("startRound", 0),
        "EndRound": body.get("endRound", 0),
        "Towers": body.get("_towers", None),
        "Map": body.get("map", None),
        "Maps": body.get("maps", None), 
        "Modifiers": {
                "Bloon_Modifiers": body.get("_bloonModifiers", None),
                "MKDisabled": body.get("disableMK", False),
                "NoSelling": body.get("disableSelling", False),
                "NoContinues": body.get("noContinues", False),
                "LeastTiers": body.get("leastTiersUsed", False),
                "LeastCash": body.get("leastCashUsed", False),
                "PowersDisabled": body.get("disablePowers", False), 
                "AbilityCooldown": body.get("abilityCooldownReductionMultiplier", 0),
                "RemovableCost": body.get("removeableCostMultiplier", 0),
                "MaxTowers": body.get("maxTowers", 0),
                "MaxParagons": body.get("maxParagons", 0)
            },
        "Odyssey": {
            "Extreme": body.get("isExtreme", False),
            "MaxTowers": body.get("maxMonkeySeats", 0),
            "MaxSlots": body.get("maxMonkeysOnBoat", 0),
            "StartHealth": body.get("startingHealth", 0),
            "AvailableTowers": body.get("_availableTowers", None)
        },
        "CT": {
            "TileType": body.get("TileType", None),
            "Relic": body.get("RelicType", None),
            "GameData": body.get("GameData", None)
        },
        "Challenge": {
            "Name": body.get("name", None),
            "ID": body.get("id", None),
            "Creator": body.get("creator", None),
            "Wins": body.get("wins", None),
            "Losses": body.get("losses", None) 
        }
    } 
