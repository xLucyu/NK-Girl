import re 

def splitUppercase(string: str) -> str:

    if string == "Tutorial":
        string = "MonkeyMeadows"
    if string == "Clicks":
            string = "Chimps"

    split = re.findall(r"[A-Z][a-z]*", string)
    return " ".join(split)

def removeNumbers(string: str) -> str:

    split = re.sub(r'\d+', '', string)
    return split

def splitNumbers(string: str) -> str | None:

    split = re.match(r"(\D*)(\d*)", string)
    if split:
        name, number = split.groups()
        return f"{name} #{number}"


