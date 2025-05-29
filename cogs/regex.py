import re 

def splitUppercase(string: str) -> str | None:

    if not string:
        return None

    if string == "Tutorial":
        string = "MonkeyMeadows"
    if string == "Clicks":
        string = "Chimps"
    if string == "#ouch":
        return "#ouch"

    split = re.findall(r"[A-Z][a-z]*", string)
    return " ".join(split)

def splitNumbers(string: str) -> str | None:

    split = re.match(r"(\D*)(\d*)", string)
    if split:
        name, number = split.groups()
        return f"{name} #{number}"
    else:
        return None

