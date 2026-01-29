import dacite
from discord import Embed
from typing import Type, TypeVar, Any, Dict, List, Union, Tuple, Optional
from datetime import datetime, timezone 
from cogs.eventNumber import getNumberForEvent
from cogs.regex import *
from cogs.currentEvent import getCurrentActiveEvent
from api.fetchId import getID, getData 
from api.emojis import getEmojis
from utils.filter.filterTowers import filterTowers
from utils.filter.filterBloonsModifiers import filterModifiers 
from utils.filter.createEmbed import filterEmbed
from utils.dataclasses.metaData import MetaBody, Tower
from utils.dataclasses.ct import DcModel
from utils.dataclasses.main import NkData, Body

T = TypeVar("T")

class BaseCommand:
 
    @staticmethod 
    def transformDataToDataClass(dataclass: Type[T], data: dict[str, Any]) -> T: 
        return dacite.from_dict(data_class=dataclass, data=data) 
     
    @staticmethod 
    def useApiCall(url: str) -> dict:
        return getData(url) or {} 
 
    @staticmethod 
    def getCurrentEventData(urls: dict, index: int) -> dict:
        return getID(urls, index) or {} 
 
    @staticmethod 
    def getAllEmojis() -> dict:
        return getEmojis() or {} 
 
    @staticmethod 
    def getActiveTowers(towers: list[Tower], emotes: dict) -> dict:
        return filterTowers(towers, emotes) or {}
     
    @staticmethod 
    def getActiveModifiers(body: MetaBody, emotes: dict) -> list:
        
        modifiers = {
            "BloonModifiers": body._bloonModifiers,
            "MKDisabled": body.disableMK,
            "NoSelling": body.disableSelling,
            "NoContinues": body.noContinues,
            "LeastTiers": body.leastTiersUsed,
            "LeastCash": body.leastCashUsed,
            "PowersDisabled": body.disablePowers,
            "AbilityCoolDown": body.abilityCooldownReductionMultiplier,
            "RemoveableCost": body.removeableCostMultiplier,
            "MaxTowers": body.maxTowers,
            "MaxParagons": body.maxParagons
        }

        return filterModifiers(modifiers, emotes)
    
    @staticmethod
    def getActiveModifiersForCt(dcModel: DcModel, emotes: dict) -> list:

        activeModifiers = { 
            "BloonModifiers": dcModel.bloonModifiers,
            "MKDisabled": dcModel.disableMK,
            "NoSelling": dcModel.disableSelling,
            "MaxTowers": dcModel.maxTowers
            } 

        return filterModifiers(activeModifiers, emotes)

    @staticmethod 
    def getCurrentEventNumber(eventTimeStamp: int, mode: str) -> int | None:
        return getNumberForEvent(eventTimeStamp, mode)

    @staticmethod 
    def splitUppercaseLetters(string: str) -> str:
        return splitUppercase(string)

    @staticmethod 
    def splitBossNames(string: str) -> str: 
        return splitNumbers(string)

    @staticmethod
    def convertStrToMs(string: str) -> float:
        return convertStringToMs(string)

    @staticmethod 
    def getCurrentTimeStamp() -> int:
        return int(datetime.now(timezone.utc).timestamp() * 1000)

    @staticmethod
    def getCurrentEvent(mainData: NkData) -> Tuple[int, Body]:

        currentTimeStamp = BaseCommand.getCurrentTimeStamp()
        return getCurrentActiveEvent(mainData, currentTimeStamp)
    
    @staticmethod
    def getCurrentIndexForEvent(index: Optional[int], baseURL: str) -> int:

        if index is None:

            rawNkData = BaseCommand.useApiCall(baseURL)
            mainData = BaseCommand.transformDataToDataClass(NkData, rawNkData)
            index, _ = BaseCommand.getCurrentEvent(mainData)

        return index

    @staticmethod 
    def createEmbed(eventData: Dict[str, List[Union[str, bool]]], url: str, title: str) -> Embed:
        return filterEmbed(eventData, url, title)
    
