from dataclasses import dataclass
from typing import Callable, TypeVar, Generic 
from discord import Message
from api.eventContext import EventContext, ProfileContext 
from utils.dataclasses import EventResult, PreviousEventLabel

T = TypeVar("T")
K = TypeVar("K")

@dataclass
class ViewContext(Generic[T, K]):
    message: Message | None
    userID: int
    eventID: str    
    difficulty: str 
    eventName: str
    eventContext: EventContext 
    eventData: ProfileContext
    previousEvents: list[PreviousEventLabel] 
    buttonLayout: list[list[str]] | None
    metaDataObject: T
    subResourceObject: K | None
    subURLResolver: Callable[[T], str] | None
    emoji: str 
    function: Callable[[ProfileContext[T,K]], EventResult] 
    # CT
    tiles: list | None
    ctEventIndex: int | None
    # BossDetails
    boss: str | None
    hpMultiplier: float | None 
    playerCount: int | None
