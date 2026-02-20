from math import ceil
from dataclasses import dataclass
from utils.dataclasses import EventBody
from .timeStamps import timeStampToUTCTimeFormat

@dataclass 
class RotationPage:
    Instas: list[str]
    TimeStamp: str

@dataclass
class InstaSchedule:
    start: str
    end: str 
    Rotations: dict[int, RotationPage]

TWO64 = 1 << 64
TWO63 = 1 << 63
MOD_PM = 2147483647
MOD_PM_MINUS1_NUM = 2147483646


def toLong(num: int) -> int:

    v = num & (TWO64 - 1)
    if v >= TWO63:
        v -= TWO64
    return v


def longAbs(num: int) -> int:

    if num == -TWO63:
        return num
    return -num if num < 0 else num


def I64(string: str) -> int:

    result = 0
    for char in string:
        digit = ord(char) - 48
        result = toLong(toLong(result * 10) + digit)
    return result


def getSeedLong(eventID: str) -> int:

    subString = ""
    for char in eventID:
        subString += str(ord(char))

    if len(subString) > 18:
        subString = subString[:18]

    parsed = I64(subString)
    return longAbs(parsed)


class SeededRandom:

    def __init__(self, seed: int):

        if seed < 0:
            seed = longAbs(seed)
        self.seed = seed

    def next(self) -> int:
        self.seed = toLong(self.seed * 16807)
        self.seed = self.seed % MOD_PM
        return self.seed

    def next_float(self) -> float:
        return self.next() / MOD_PM_MINUS1_NUM

    def range(self, minVal: int, maxVal: int) -> int:

        if minVal == maxVal:
            return minVal
        
        span = maxVal - minVal
        r = self.next() % span
        return minVal + r


def shuffleSeed(seedLong: int, inputList: list[str]) -> list[str]:
    
    rng = SeededRandom(seedLong)
    lst = inputList.copy()
    length = len(lst)

    for i in range(length):
        j = rng.range(i, length)
        if 0 <= j < length:
            lst[i], lst[j] = lst[j], lst[i]

    return lst


class CollectionEventHelper:

    def __init__(self):

        self.instasList: list[str] = []
        self.getCurrentPageNumber = lambda: 0

    def getPossibleInstas(self) -> list[str]:

        maxInstasPerPage = 4

        lst = self.instasList
        if not lst:
            return []

        totalCount = len(lst)
        pageSize = ceil(totalCount * 0.25)

        currentPage = self.getCurrentPageNumber()
        outerIndex = 0

        while pageSize < currentPage:
            currentPage -= pageSize
            outerIndex += 1

        pageItems = []

        for i in range(maxInstasPerPage):
            rotIndex = (i + outerIndex + currentPage * maxInstasPerPage) % totalCount
            pageItems.append(lst[rotIndex])

        return pageItems


def processCollectionEvent(eventData: EventBody) -> InstaSchedule:

    seed = getSeedLong(eventData.id)

    secondsPerRotation = 28800  # 8 hours

    max_pages = ceil(
        (eventData.end - eventData.start) /
        (secondsPerRotation * 1000)
    )

    featuredInstas = [
        "Alchemist", "BananaFarm", "BombShooter", "BoomerangMonkey",
        "DartMonkey", "Druid", "GlueGunner", "HeliPilot",
        "IceMonkey", "MonkeyAce", "MonkeyBuccaneer", "MonkeySub",
        "MonkeyVillage", "NinjaMonkey", "SniperMonkey", "SpikeFactory",
        "SuperMonkey", "TackShooter", "WizardMonkey", "MortarMonkey",
        "EngineerMonkey", "DartlingGunner", "BeastHandler",
        "Mermonkey", "Desperado"
    ]

    shuffledInstas = shuffleSeed(seed, featuredInstas)

    helper = CollectionEventHelper()
    helper.instasList = shuffledInstas

    rotationPages = {}

    for page in range(max_pages):

        helper.getCurrentPageNumber = lambda p = page: p
        timeStamp = eventData.start + page * secondsPerRotation * 1000

        rotationPages[page] = RotationPage(
            Instas = helper.getPossibleInstas(),
            TimeStamp = timeStampToUTCTimeFormat(timeStamp)
        )

    return InstaSchedule(
        Start = timeStampToUTCTimeFormat(eventData.start),
        End = timeStampToUTCTimeFormat(eventData.end),
        Rotations = rotationPages
    )
