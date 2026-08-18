import {
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder
} from "discord.js";

import { usageTable } from "@database";
import { config } from "@config";
import { MissingPermission } from "@utils";

export class UsageCommand {

  public commandData = new SlashCommandBuilder()
    .setName("usage")
    .setDescription("Show command usage statistics")
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .setContexts(InteractionContextType.Guild);

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    if (interaction.user.id !== config.OWNER_ID) throw new MissingPermission();

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
