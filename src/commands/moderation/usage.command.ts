import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder
} from "discord.js";
import { usageTable } from "@database";
import { MissingPermission } from "@lib";
import { CONFIG } from "@app";
import { Command } from "@discord";

@Command({
  description: "Check usage for commands",
  autoComplete: false,
  cooldown: 0
})
export class UsageCommand {

  public commandData = new SlashCommandBuilder()

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    if (interaction.user.id !== CONFIG.OWNER_ID) throw new MissingPermission();

    await interaction.deferReply();

    const commands = await usageTable.fetchCommands();

    const total = commands.reduce((sum, command) => sum + command.uses, 0);

    const usage = commands
      .map((command) =>
        `/${command.command}: ${command.uses.toLocaleString()}`
      )
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle("Command Usage Overview")
      .setDescription(
        usage.length > 0
          ? `\`\`\`\n${usage}\n\`\`\``
          : "No command usage has been recorded yet."
      )
      .addFields({
        name: "Total Uses",
        value: total.toLocaleString()
      })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
}
