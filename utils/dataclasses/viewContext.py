from dataclasses import dataclass
from typing import Callable  
from discord import Message
from utils.dataclasses import PreviousEventLabel

@dataclass
class ViewContext:
    message: Message | None
    userID: int
    eventID: str    
    difficulty: str 
    eventName: str
    previousEvents: list[PreviousEventLabel] 
    buttonLayout: list[list[str]] | None
    emoji: str 
    function: Callable  
    # CT
    tiles: list | None
    ctEventIndex: int | None
    # BossDetails
    boss: str | None
    hpMultiplier: float | None 
    playerCount: int | None
