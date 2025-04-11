import discord

def filterembed(EventData: dict, url: str, title: str) -> discord.Embed:

    embed = discord.Embed(title=title, description="", color=discord.Color.green())
    embed.set_thumbnail(url=url)

    for key, value in EventData.items():
        if value[0]:
            embed.add_field(name=key, value=value[0], inline=value[1])

    return embed
