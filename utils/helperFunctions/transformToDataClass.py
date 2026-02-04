from dacite import from_dict
from typing import TypeVar 

T = TypeVar("T")

def transformDataToDataClass(dataclass: T, data: dict) -> T:
    return from_dict(data_class = dataclass, data = data)
