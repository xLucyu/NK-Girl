from utils.assets.modifiers import modifiers

NOKEYS = ["MaxParagons", "MaxTowers", "LeastTiers"]

def modifieremotefilter(activemodifiers: dict, emotes: dict) -> list:
    
    modifieremotes = list()
 
    for modifier, multiplier in activemodifiers.items():

        key = "" if modifier in NOKEYS or multiplier is True else "Increase" if multiplier > 100 else "Decrease"
        
        modifierName = f"{modifier}{key}"
        emoteid = emotes.get(modifierName, None)
        name = modifiers.get(modifier)

        if multiplier is True:
            value = ""
        elif modifier == "LeastCash":
            value = f"${multiplier:,} "
        elif key == "":
            value = f"{multiplier} "
        else:
            value = f"{multiplier}% "

        modifieremotes.append(f"<:{modifierName}:{emoteid}> {value}{name}")


    return modifieremotes
        

def handlemodifiers(modifiers: dict) -> dict:

    activemodifiers = dict()

    for modifier, multiplier in modifiers.items():
        
        match multiplier:

            case True:
                activemodifiers[modifier] = True

            case dict():
                activemodifiers.update(handlemodifiers(multiplier))

            case 1 | 9999 | False | -1:
                continue

            case int() | float():

                if modifier == "MaxParagons" and multiplier == 10:
                    continue

                if modifier == "MaxTowers" and multiplier == 0:
                    continue

                value = (multiplier if modifier in NOKEYS else int(multiplier*100)) 

                activemodifiers[modifier] = value

    return activemodifiers
                

def filtermodifiers(modifiers: dict, emotes: dict) -> list:
     
    activemodifiers = handlemodifiers(modifiers) 
    return modifieremotefilter(activemodifiers, emotes)
