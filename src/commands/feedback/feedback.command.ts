import { 
  ApplicationIntegrationType, 
  ChannelType, 
  ChatInputCommandInteraction, 
  Colors, 
  EmbedBuilder, 
  InteractionContextType, 
  MessageFlags, 
  ModalSubmitInteraction, 
  SlashCommandBuilder 
} from "discord.js";
import { BuildModalMenu } from "@components";
import { config } from "@config";
import { discordClient } from "@client";

export class FeedbackCommand {

  public commandData = new SlashCommandBuilder()
    .setName("feedback")
    .setDescription("Send feedback or submit an error")
    .setIntegrationTypes(
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall
    )
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel
    )

  public async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const modal = this.buildModal();
    await interaction.showModal(modal);
  }

  private buildModal() {
    return BuildModalMenu({
      customId: "feedback:modal:submit",
      title: "Feedback",
      inputId: "input",
      inputLabel: "Feedback",
      placeholder: "e.g. idea or error code",
    });
  }

  public async handleModal(interaction: ModalSubmitInteraction) {

    const feedback = interaction.fields.getTextInputValue("input");
    const channel = await discordClient.client.channels.fetch(config.SUBMISSIONCHANNEL);

    if (!channel?.isSendable()) throw new Error(`Submission channel ${config.SUBMISSIONCHANNEL} is not sendable.`);

    const embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle("New Feedback")
      .setDescription(feedback)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .addFields({
        name: "User",
        value: `${interaction.user.username} (${interaction.user.id})`,
      })
      .setTimestamp();

    try {
    await channel.send({ embeds: [embed] });
    await interaction.followUp({
      content: "Your Modal has been submitted",
      flags: MessageFlags.Ephemeral
    });
    } catch {
      await interaction.followUp({
        content: "Something went wrong, a notification has been sent to the owner. Please try again",
        flags: MessageFlags.Ephemeral
      });
    }
  }
}
