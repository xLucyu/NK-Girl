from dataclasses import dataclass 

@dataclass
class EventBody: 
  id: str 
  type: str
  name: str
  start: int
  end: int
  url: str

@dataclass
class Events:
  error: int 
  success: bool
  body: EventBody
