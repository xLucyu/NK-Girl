from dataclasses import dataclass, asdict
from discord import Embed 

@dataclass
class PreviousEventLabel:
    label: str
    value: str
    description: str

    def toDict(self) -> dict[str, str]:
        return asdict(self)


@dataclass
class EventResult:
    embed: Embed
    previousEvents: list[PreviousEventLabel]
