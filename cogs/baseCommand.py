from api.fetchId import getID, getData 
from api.emojis import getEmojis
from utils.filter.filterTowers import filterTowers
from utils.filter.filterBloonsModifiers import filterModifiers 
from utils.filter.createEmbed import filterEmbed
from utils.dataclasses.metaData import Body, Tower

class BaseCommand:
    
    @staticmethod 
    def useApiCall(url: str) -> dict:
        return getData(url)

    @staticmethod 
    def getCurrentEventData(urls: dict, index: int) -> dict | None:
        return getID(urls, index)

    @staticmethod 
    def getAllEmojis() -> dict:
        return getEmojis() or {} 

    @staticmethod 
    def getActiveTowers(towers: list[Tower], emotes: dict) -> list:
        return filterTowers(towers, emotes)
    
    @staticmethod 
    def getActiveModifiers(body: Body, emotes: dict) -> list:

        modifiers = {
            "BloonModifiers": body._bloonModifiers,
            "MkDisabled": body.disableMK,
            "NoSelling": body.disableSelling,
            "NoContinues": body.noContinues,
            "LeastTiers": body.leastTiersUsed,
            "LeastCash": body.leastCashUsed,
            "PowersDisabled": body.disablePowers,
            "AbilityCoolDown": body.abilityCooldownReductionMultiplier,
            "RemovableCost": body.removableCostMultiplier,
            "MaxTowers": body.maxTowers,
            "MaxParagons": body.maxParagons
        }

        return filterModifiers(modifiers, emotes)

    @staticmethod 
    def createEmbed(eventData: dict, url: str, title: str):
        return filterEmbed(eventData, url, title)

