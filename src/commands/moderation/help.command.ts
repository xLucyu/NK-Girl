import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "@discord";

@Command({
  description: "See all this bots potential!",
  cooldown: 7000
})
export class HelpCommand {

  public commandData = new SlashCommandBuilder()

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    const botUser = interaction.client.user;

    const embed = new EmbedBuilder()
      .setTitle(`${botUser?.username}'s Help Menu`)
      .setDescription("This will give you an overview of this bot's potential!")
      .setColor("Blue")
      .addFields(
        {
          name: "Owners",
          value: "xlucyu",
          inline: false,
        },
        {
          name: "Contributors",
          value: "minecool and spani333",
          inline: false,
        },
        {
          name: "Overview",
          value:
            "This bot was created to centralize all BTD6 events into one bot with a few extras. It focuses on simplicity and flexibility.",
          inline: false,
        },
        {
          name: "Commands",
          value:
            "Try `/race` or `/boss` to display the current event as well as previous ones. If you want exact boss HP values, use `/bossdetails`.",
          inline: false,
        },
        {
          name: "Feedback",
          value:
            "By typing `/feedback` you can submit errors or improvements for this bot without needing GitHub. These submissions are stored in a private Discord where only the owners have access. Please refrain from contacting us directly through DMs at first <3",
          inline: false,
        },
        {
          name: "Leaderboards",
          value:
            "We offer leaderboards for every gamemode as well as multiplayer leaderboards for bosses. Use `/leaderboard` and provide the required credentials to get the current leaderboard. Multiplayer boss leaderboards may take some time to load.",
          inline: false,
        },
        {
          name: "GitHub",
          value:
            "This project is open source, so feel free to view the code [here](https://github.com/xLucyu/NK-Girl).",
          inline: false,
        },
      )
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      });

    if (botUser) {
      embed.setThumbnail(botUser.displayAvatarURL());
    }

    await interaction.reply({embeds: [embed] });
  }
}