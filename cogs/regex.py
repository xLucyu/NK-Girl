import re 

def splitUppercase(string: str) -> str:

    specialCases = {
        "Tutorial": "Monkey Meadows",
        "Clicks": "Chimps",
        "#ouch": "#ouch"
    }
    
    if string in specialCases:
        return specialCases[string]

    split = re.findall(r"[A-Z][a-z]*", string)
    return " ".join(split)

def splitNumbers(string: str) -> str:

    split = re.match(r"(\D*)(\d*)", string)
    if split:
        name, number = split.groups()
        return f"{name} #{number}"
    return "" 

def convertStringToMs(string: str) -> float:
    
    string = string.strip()

    match = re.fullmatch(r"(\d+):(\d{1,2})(?:\.(\d{1,2}))?", string)
    if match:
        minutes = int(match.group(1))
        seconds = int(match.group(2))
        fraction = match.group(3) or "0"
    else: 
        match = re.fullmatch(r"(\d+)(?:\.(\d{1,2}))?", string)
        if not match:
            raise ValueError("InvalidTimeFormat")

        minutes = 0
        seconds = int(match.group(1))
        fraction = match.group(2) or "0"
 
    if len(fraction) == 1:
        centiseconds = int(fraction) * 10
    else:
        centiseconds = int(fraction[:2].ljust(2, "0"))

    return minutes * 60 + seconds + centiseconds / 100  
