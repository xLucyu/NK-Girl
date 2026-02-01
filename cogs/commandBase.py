import dacite
from discord import Embed
from datetime import datetime, timezone 
from typing import (
    Type,
    TypeVar,
    Any,
    Dict,
    List,
    Union,
    Tuple,
    Optional
)
from api.wrapper import ApiWrapper
from utils.dataclasses import (
    MetaBody,
    Tower,
    DcModel,
    NkData,
    Body
)
from utils.helperFunctions import (
    getCurrentActiveEvent,
    getNumberForEvent,
    filterModifiers,
    filterTowers, 
    splitNumbers,
    splitUppercase,
    convertStringToMs
) 

T = TypeVar("T")

class CommandBase:

    _wrapper = ApiWrapper()
 
    @staticmethod 
    async def useApiCall(url: str, headers: Optional[dict[str, str]] = None) -> dict:
        return await CommandBase._wrapper.get(url, headers)

    @staticmethod 
    def transformDataToDataClass(dataclass: Type[T], data: dict[str, Any]) -> T: 
        return dacite.from_dict(data_class=dataclass, data=data)
          
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

        currentTimeStamp = CommandBase.getCurrentTimeStamp()
        return getCurrentActiveEvent(mainData, currentTimeStamp)
    
    @staticmethod
    def getCurrentIndexForEvent(index: Optional[int], baseURL: str) -> int:

        if index is None:

            rawNkData = CommandBase.useApiCall(baseURL)
            mainData = CommandBase.transformDataToDataClass(NkData, rawNkData)
            index, _ = CommandBase.getCurrentEvent(mainData)

        return index

    @staticmethod 
    def createEmbed(eventData: Dict[str, List[Union[str, bool]]], url: str, title: str) -> Embed:
        return filterEmbed(eventData, url, title)
    
