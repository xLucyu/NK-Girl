import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { deployCommands } from "../../deploy.commands";


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

  async execute(interaction: ChatInputCommandInteraction) {

    await interaction.deferReply();

    if (interaction.user.id !== config.OWNER_ID) return interaction.editreply({
        content: "You don't have permission to run this command.",
        ephemeral: true
    })

    const option = interaction.options.getString("sync_option");

    if (option === "global") {
        await deployCommands({ guildId: config.guild.id });
        return interaction.editReply("Synced global commands.");
    } else {
        await deployCommands();
        return interaction.editReply("Synced debug commands.");
    }
  }
}
