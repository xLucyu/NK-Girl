import discord

def filterout(value):
    
    if value:
        return True 
    return False

def filterembed(EventData, url, title):

    embed = discord.Embed(title=title, description="", color=discord.Color.green())
    embed.set_thumbnail(url=url)

    for key, value in EventData.items():
        if filterout(value[0]):
            embed.add_field(name=key, value=value[0], inline=value[1])

    return embed
