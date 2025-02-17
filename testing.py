import cv2 
import numpy as np 
import urllib.request

def drawbox(image, position, title_text, main_text, box_height, title_color, sub_text_color, box_color, alpha, font_scale=0.8, thickness=2):
    x, y = position

    default_width = 200
    
    title_size = cv2.getTextSize(title_text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, thickness)[0]
    title_width = title_size[0]
    title_height = title_size[1]

    # Split the main_text into lines if it's too long
    lines = main_text.split('\n')
    line_heights = [cv2.getTextSize(line, cv2.FONT_HERSHEY_SIMPLEX, font_scale, thickness)[0][1] for line in lines]
    main_width = max([cv2.getTextSize(line, cv2.FONT_HERSHEY_SIMPLEX, font_scale, thickness)[0][0] for line in lines])

    # Calculate the box width based on the longest line of text
    box_width = max(default_width, max(title_width, main_width) + 50)

    # Create overlay and output images
    overlay = image.copy()
    output = image.copy()

    # Draw rounded rectangle box
    radius = int(min(box_width, box_height) * 0.2)
    rect_color = box_color[:3]

    # Top and bottom rectangles
    cv2.rectangle(overlay, (x + radius, y), (x + box_width - radius, y + box_height), rect_color, -1, cv2.LINE_AA)
    cv2.rectangle(overlay, (x, y + radius), (x + box_width, y + box_height - radius), rect_color, -1, cv2.LINE_AA)

    # Circles for rounded corners
    cv2.circle(overlay, (x + radius, y + radius), radius, rect_color, -1, cv2.LINE_AA)
    cv2.circle(overlay, (x + box_width - radius, y + radius), radius, rect_color, -1, cv2.LINE_AA)
    cv2.circle(overlay, (x + radius, y + box_height - radius), radius, rect_color, -1, cv2.LINE_AA)
    cv2.circle(overlay, (x + box_width - radius, y + box_height - radius), radius, rect_color, -1, cv2.LINE_AA)

    # Apply transparency
    cv2.addWeighted(overlay, alpha, output, 1 - alpha, 0, output)

    # Center the title text
    title_x = x + (box_width - title_width) // 2
    if main_text == "":
        title_y = y + (box_height + title_height) // 2
    else:
        title_y = y + 40

    # Draw title text
    cv2.putText(output, title_text, (title_x, title_y), cv2.FONT_HERSHEY_SIMPLEX, font_scale, title_color, thickness, cv2.LINE_AA)

    # Draw subtext (main text), multiple lines if necessary
    current_y = title_y + title_height + 20  # Space between title and subtext
    for line, line_height in zip(lines, line_heights):
        main_x = x + (box_width - cv2.getTextSize(line, cv2.FONT_HERSHEY_SIMPLEX, font_scale, thickness)[0][0]) // 2
        cv2.putText(output, line, (main_x, current_y), cv2.FONT_HERSHEY_SIMPLEX, font_scale, sub_text_color, thickness, cv2.LINE_AA)
        current_y += line_height + 10  # Adjust space between lines

    return output


def add_space(text):
    spaced_text = ''
    for char in text:
        if char.isupper() and spaced_text:
            spaced_text += ' '  # Add space before uppercase letters
        spaced_text += char
    return spaced_text


def generate(blur, monkeys):

    x = 50  
    y = 50  
    spacing = 25  

    info = [
        ("Explosive Chaos - Race #318", "", None, 80, (255, 255, 255), (255, 255, 255)),
        ("Monkey Meadow - Medium - Standard", "", None, 80, (255, 255, 255), (255, 255, 255)),
        ("Lives", "100/100", None, 100, (255, 255, 255), (255, 255, 255)),
        ("Cash", "$1650", None, 100, (255, 255, 255), (255, 255, 255)),
        ("Rounds", "10/100", None, 100, (255, 255, 255), (255, 255, 255)),
       # ("Heroes", ", ".join(add_space(monkey) for monkey in monkeys[0]), None, 100, (255, 255, 255), (255, 255, 255)),
        ("Primary", "\n".join(add_space(monkey) for monkey in monkeys[1]), None, 280, (255, 200, 0), (255, 255, 255)),
        ("Military", "\n".join(add_space(monkey) for monkey in monkeys[2]), None, 280, (0, 255, 0), (255, 255, 255)),
        ("Magic", "\n".join(add_space(monkey) for monkey in monkeys[3]), None, 280, (255, 0, 255), (255,255,255)),
        ("Support", "\n".join(add_space(monkey) for monkey in monkeys[4]), None, 280, (255, 165, 255), (255, 255, 255))
    ]

    for i, (title, subtext, position, height, title_color, sub_text_color) in enumerate(info):
    
        title_width = cv2.getTextSize(title, cv2.FONT_HERSHEY_SIMPLEX, 1, 2)[0][0]
        
        lines = subtext.split("\n")
        subtext_width = max(cv2.getTextSize(line, cv2.FONT_HERSHEY_SIMPLEX, 1, 2)[0][0] for line in lines)
        
        box_width = max(title_width, subtext_width) + 10

        if position is None:
            position = (x, y)

        blur = drawbox(
            blur,
            position,
            title,
            subtext,
            height,
            title_color,
            sub_text_color,
            box_color=(0, 0, 0),
            alpha=0.8
        )

        # Update x and y based on the box type
        if 2 <= i <= 3 or title == "Primary" or title == "Magic":
            x += box_width + spacing  
        else:
            x = 50
            y += height + spacing

    return blur



def main(modifiers, monkeys, mapURL):
    
    
    response = urllib.request.urlopen(mapURL)
    imagedata = np.asarray(bytearray(response.read()), dtype=np.uint8)

    image = cv2.imdecode(imagedata, cv2.IMREAD_COLOR)
    resized_image = cv2.resize(image, (1100, 1000), interpolation=cv2.INTER_LINEAR)
    blur = cv2.GaussianBlur(resized_image, (25, 25), 0)

    blur = generate(blur, monkeys)

    cv2.imshow("Blurred", blur) #type: ignore

    cv2.waitKey(10000)
    cv2.destroyAllWindows()
 

    




modifiers = {'Boss_Bloon_Modifiers': {'speedMultiplier': '75 %', 'moabSpeedMultiplier': '70 %', 'bossSpeedMultiplier': '50 %', 'healthMultipliers': {'bloons': '80 %', 'moabs': '80 %', 'boss': '200 %'}}}

monkeys = [["Geraldo", "Corvus", "Gwendolin", "Etienne", "Striker Jones", "Psi", "Pat Fusty, Adora, Benjamin"], ['BombShooter', '5xBoomerangMonkey (5,5,5)', 'DartMonkey', 'GlueGunner', 'IceMonkey', 'TackShooter'], ['6xMonkeyBuccaneer (5,5,5)', 'MonkeySub', 'SniperMonkey', '6xMortarMonkey (5,5,5)', 'DartlingGunner', "MonkeyAce", "HeliPilot"], ['Alchemist', 'Druid', 'NinjaMonkey', 'SuperMonkey', '4xWizardMonkey (5,5,5)', 'Mermonkey'], ['BananaFarm', 'MonkeyVillage', 'SpikeFactory', '4xEngineerMonkey (5,5,5)', "4xBeastHandler (5,5,5)"]]

mapURL = "https://static-api.nkstatic.com/appdocs/4/assets/opendata/21ff344158bc931834eae2e3dbd390b4_MapSelectTinkertonButton.png" 

main(modifiers, monkeys, mapURL)
