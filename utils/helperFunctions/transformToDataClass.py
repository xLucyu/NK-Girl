from dacite import from_dict
from typing import TypeVar, Type   

T = TypeVar("T")

def transformDataToDataClass(dataclass: Type[T], data: dict) -> T:
    return from_dict(data_class = dataclass, data = data)
