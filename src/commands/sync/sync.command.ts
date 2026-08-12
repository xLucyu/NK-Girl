import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { deployCommands } from "@client";
import { config } from "@config";
import { MissingPermission } from "@utils";

export class SyncCommand {

  public commandData = new SlashCommandBuilder()
    .setName("sync")
    .setDescription("sync commands")
    .addStringOption((option) =>
    option 
      .setName("sync_option")
      .setDescription("Choose a Sync option.")
      .setRequired(true)
      .addChoices(
        { name: "global", value: "global" },
        { name: "debug", value: "debug" }
      )
    );

  public async execute(interaction: ChatInputCommandInteraction) {

    await interaction.deferReply();

    if (interaction.user.id !== config.OWNER_ID) throw new MissingPermission();

    const option = interaction.options.getString("sync_option");

    if (option === "global") {
      await deployCommands();
      await interaction.editReply("Synced global commands.");
    } else {
      await deployCommands({ guildId: interaction.guild?.id });
      await interaction.editReply("Synced debug commands.");
    }
  }
}
