import { 
  ChatInputCommandInteraction, 
  Colors, 
  EmbedBuilder, 
  MessageFlags, 
  ModalSubmitInteraction 
} from "discord.js";
import { CONFIG, discordClient } from "@app";
import { BuildModalMenu, Command } from "@discord";


@Command({
  description: "Send Feedback to the bots owner",
  cooldown: 25000
})
export class FeedbackCommand {

  public async execute(interaction: ChatInputCommandInteraction) {
    const modal = this.buildModal();
    await interaction.showModal(modal);
  }

  public buildModal() {
    return BuildModalMenu({
      customId: "feedback:modal:submit",
      title: "Feedback",
      inputId: "input",
      inputLabel: "Feedback",
      placeholder: "e.g. idea or error code",
    });
  }

  public async handleModal(interaction: ModalSubmitInteraction): Promise<void> {

    await interaction.deferReply();
    const feedback = interaction.fields.getTextInputValue("input");
    const channel = await discordClient.client.channels.fetch(CONFIG.SUBMISSION_CHANNEL);

    if (!channel?.isSendable()) throw new Error(`Submission channel ${CONFIG.SUBMISSION_CHANNEL} is not sendable.`);

    const embed = new EmbedBuilder()
      .setColor(Colors.DarkVividPink)
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
        content: "Something went wrong, please try again",
        flags: MessageFlags.Ephemeral
      });
    }
  }
}
