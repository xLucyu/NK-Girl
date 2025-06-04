import re 

def splitUppercase(string: str) -> str:

    specialCases = {
        "Tutorial": "MonkeyMeadows",
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

