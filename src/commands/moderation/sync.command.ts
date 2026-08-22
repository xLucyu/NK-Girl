import { 
  ApplicationIntegrationType, 
  ChatInputCommandInteraction, 
  InteractionContextType, 
  SlashCommandBuilder 
} from "discord.js";
import { CONFIG, deployCommands } from "@app";
import { Command } from "@discord";
import { MissingPermission } from "@lib";


@Command({
  description: "Sync Commands, Owner only",
  cooldown: 0,
})
export class SyncCommand {

  public commandData = new SlashCommandBuilder()
    .addStringOption((option) =>
    option 
      .setName("sync_option")
      .setDescription("Choose a Sync option.")
      .setRequired(true)
      .addChoices(
        { name: "global", value: "global" },
        { name: "debug", value: "debug" }
      )
    )
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .setContexts(InteractionContextType.Guild);

  public async execute(interaction: ChatInputCommandInteraction) {

    await interaction.deferReply();

    if (interaction.user.id !== CONFIG.OWNER_ID) throw new MissingPermission();

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
