import { 
  Client, 
  GatewayIntentBits, 
  Interaction, 
  Partials 
} from "discord.js";
import { config } from "@config";
import { deployCommands } from "./deploy.commands";
import { handleInteraction } from "@commands";
import { eventManager } from "@manager";

export class DiscordClient {

  public client: Client;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User
      ], 
    });
  }

  public async startEventManager() {
    await eventManager.start();
    console.log("EventManager started");
  }

  public async addListeners() {

    this.client.once("clientReady", async () => {
      console.log(`Bot is online as ${this.client.user?.tag}`);
    });
      
    this.client.on("guildCreate", async (guild) => {

      await deployCommands({ guildId: guild.id });
      console.log(`Deployed commands to new guild: ${guild.name}`);
    });

    this.client.on("interactionCreate", async (interaction: Interaction) => {
      await handleInteraction(interaction);
    })

    this.client.on("error", (error) => console.error("client error", error));
  }

  public async start() {
    await this.client.login(config.BOT_TOKEN);
    console.log("client logged in");
  }

  public async destroy() {
    this.client.removeAllListeners();
    this.client.destroy();
    console.log("Discord client shutdown");
  }
}

export const discordClient = new DiscordClient();
