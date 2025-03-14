from utils.assets.categories import categories

def handle_information(emote: str, max: int, name: str, tiers: list, category: str) -> str:

    string = str()
    
    string += f"{emote} "

    if max > 0 and category != "Heroes":
        string += f"{max}x "

    string += name 

    if tiers != [5,5,5] and category != "Heroes":
        string += f" {tuple(tiers)}"

    return string


def format_towers(allowed_towers: dict) -> list:

    formatted_list = list()

    for category, tower in allowed_towers.items():
        sublist = [handle_information(*info, category) for info in tower] #type: ignore shush pyright
        formatted_list.append(sublist)

    return formatted_list

def getTiers(tower: dict) -> list:

    return [
        max(0, 5 - (tier if tier !=-1 else 5)) # if tier is -1 it's unavailable
        for tier in [
            tower.get("path1numblockedtiers", 0),
            tower.get("path2numblockedtiers", 0),
            tower.get("path3numblockedtiers", 0)
        ]
    ]

def handlecategories(towers: dict, emotes: dict) -> dict:
    
    towerKeys = [tower for tower in towers if tower["max"] != 0]
    allowedTowers = {category: [] for category, _ in categories.items()}
    categorizedTowers = ((cat, tow) for cat, towerlist in categories.items() for tow in towerlist)

    seen = set()

    for cat, tow in categorizedTowers:
            
        emoteid = emotes.get(tow[0])

        for tower in towerKeys:

            tiers = getTiers(tower)
            if tower["tower"] == tow[0] and tow[0] not in seen: #sometimes towers appear twice in the api lol
                allowedTowers[cat].append((f"<:{tower['tower']}:{emoteid}>", tower["max"], tow[1], tiers))
                seen.add(tow[0])

        
    return allowedTowers


def filtertowers(towers: dict, emotes: dict) -> list:

    allowedtowers = handlecategories(towers, emotes)
    return format_towers(allowedtowers)
