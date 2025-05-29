from utils.assets.towerCategories import CATEGORIES
from utils.dataclasses.metaData import Tower
from typing import List, Dict

def handleInformation(category, emote: str, towerName: str, towerMax: int, towerTiers: List) -> str:
    string = str()  
    string += f"{emote} "

    if towerMax > 0 and category != "Heroes":
        string += f"{towerMax}x "

    string += towerName 

    if towerTiers != [5,5,5] and category != "Heroes":
        string += f" {tuple(towerTiers)}"

    return string


def formatTowers(allowedTowers: dict) -> list:
    formattedList = list()

    for category, tower in allowedTowers.items(): 
        sublist = [handleInformation(category, *info) for info in tower]
        formattedList.append(sublist)

    return formattedList


def getTiers(tower: Tower) -> list:
    return [
        max(0, 5 - (tier if tier !=-1 else 5)) # if tier is -1 it's unavailable
        for tier in [
            tower.path1NumBlockedTiers,
            tower.path2NumBlockedTiers,
            tower.path3NumBlockedTiers
        ]
    ]


def handleCategories(towers: List[Tower], emotes: dict) -> Dict[str, List]: 
    allowedTowers = {category: [] for category, _ in CATEGORIES.items()}
    formattedTowerNames = ((category, tower) for category, tower in CATEGORIES.items() for tower in tower)
    availableTowers = [tower for tower in towers if tower.max != 0]
    seenTowers = set()
     
    for category, apiTower in formattedTowerNames:
        towerEmoteId = emotes.get(apiTower[0])
        for tower in availableTowers:
            if apiTower[0] == tower.tower and tower.tower not in seenTowers:
                tiers = getTiers(tower)
                allowedTowers[category].append((f"<:{tower.tower}:{towerEmoteId}>", apiTower[1] ,tower.max, tiers))
                seenTowers.add(tower.tower)

    return allowedTowers 


def filterTowers(towers: List[Tower], emotes: dict) -> list: 
    allowedTowers = handleCategories(towers, emotes)
    return formatTowers(allowedTowers)
