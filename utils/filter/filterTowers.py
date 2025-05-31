from utils.assets.towerCategories import CATEGORIES
from utils.dataclasses.metaData import Tower
from typing import List 

def formatTowerToString(tower: Tower, tiers: list[int], emotes: dict) -> str: 
    towerString = f"<:{tower.tower}:{emotes.get(tower.tower)}> "

    if tower.max != -1 and not tower.isHero:
        towerString += f"{tower.max}x "

    towerString += tower.tower

    if tiers != [5,5,5] and not tower.isHero: #exclude heroes -> will always be [5,5,5]
        towerString += f" {tuple(tiers)}"
 
    return towerString 


def getTiers(tower: Tower) -> list[int]:
    return [
        max(0, 5 - (tier if tier != -1 else 5)) # if tier is -1 its equal to banned
        for tier in [
            tower.path1NumBlockedTiers,
            tower.path2NumBlockedTiers,
            tower.path3NumBlockedTiers
        ]
    ] 


def filterTowers(towers: List[Tower], emotes: dict) -> dict:
    towerKeys = ((category, tower) for category, tower in CATEGORIES.items() for tower in tower) 
    availableTowers = {tower.tower: tower for tower in towers if tower.max != 0} # filter out towers early 
    towerCategories = {category: [] for category in CATEGORIES} # creates an array for each category 

    seenTowers = set() # avoid duplicates 
    for category, tower in towerKeys:
        currentTower = availableTowers.get(tower)
        if currentTower and currentTower.tower not in seenTowers:
            tiers = getTiers(currentTower)
            formattedTowerString = formatTowerToString(currentTower, tiers, emotes)
            towerCategories[category].append(formattedTowerString)
            seenTowers.add(currentTower.tower)

    return towerCategories
