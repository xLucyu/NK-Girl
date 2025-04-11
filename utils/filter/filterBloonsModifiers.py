from utils.assets.bloonsModifiers import MODIFIERS

NOKEYS = ["MaxParagons", "MaxTowers", "LeastTiers"]

def modifieremotefilter(activemodifiers: dict, emotes: dict) -> list:
    
    modifieremotes = list()
 
    for modifier, multiplier in activemodifiers.items():

        key = "" if modifier in NOKEYS or multiplier is True else "Increase" if multiplier > 100 else "Decrease"
        
        modifierName = f"{modifier}{key}"
        emoteid = emotes.get(modifierName, None)
        name = MODIFIERS.get(modifier)

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

            case int() | float():

                if modifier not in NOKEYS:
                    if multiplier in [1, -1, False, 9999]: # filtering out all percentage based categories
                        continue 

                if multiplier <= 0 and modifier != "MaxParagons" or multiplier == 9999:
                    continue 

                if modifier == "MaxParagons" and multiplier > 9:
                    continue 

                value = (multiplier if modifier in NOKEYS else int(multiplier*100)) 

                activemodifiers[modifier] = value

    return activemodifiers
                

def filterModifiers(modifiers: dict, emotes: dict) -> list:
     
    activemodifiers = handlemodifiers(modifiers) 
    return modifieremotefilter(activemodifiers, emotes)
