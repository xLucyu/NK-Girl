import re 

def splitUppercase(string):

    if string == "Tutorial":
        string = "MonkeyMeadows"


    split = re.findall(r"[A-Z][a-z]*", string)
    return " ".join(split)

def removeNumbers(string):

    split = re.sub(r'\d+', '', string)
    return split

def splitNumbers(string):

    split = re.match(r"(\D*)(\d*)", string)
    if split:
        name, number = split.groups()
        return f"{name} #{number}"


