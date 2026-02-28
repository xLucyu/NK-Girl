from dataclasses import dataclass, field  
from typing import Optional 

@dataclass
class EventBody: 
  id: str = ""
  type: str = ""
  name: str = ""
  start: int = 0
  end: int = 0
  url: Optional[str] = None

@dataclass
class Events:
  success: bool = True 
  body: list[EventBody] = field(default_factory=list[EventBody])
