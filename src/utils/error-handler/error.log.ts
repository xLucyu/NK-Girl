import { 
  ChatInputCommandInteraction,
  Colors, 
  EmbedBuilder, 
  WebhookClient 
} from "discord.js";
import { config } from "@config";

const webhook = new WebhookClient({
  url: config.WEBHOOK_URL
});

export async function logError(context: string, error: unknown) {

  console.error(`[${context}]`, error);

  const message = error instanceof Error ? error.stack ?? error.message : String(error);

  const embed = new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle("New Bot Error")
    .addFields({
      name: "Context",
      value: context
    })
    .setDescription(message)
    .setTimestamp();

  try {
    await webhook.send({
      embeds: [embed]
    });
  } catch (error) {
    console.error(`[ErrorLogger] Failed to send webhook`, error);
  }
}
