import { 
  Client, 
  GatewayIntentBits, 
  Interaction, 
  Partials 
} from "discord.js";
import { config } from "@config";
import { deployCommands } from "./deploy.commands";
import { listener } from "@commands";
import { eventManager } from "@manager";
import { GuildTable, UsageTable } from "@database";

export class DiscordClient {

  private client: Client;
  private guildTable: GuildTable;
  private usageTable: UsageTable;

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

    this.guildTable = new GuildTable();
    this.usageTable = new UsageTable();
    this.addListeners();
  }

  public async startEventManager() {
    await eventManager.start();
    console.log("EventManager started");
  }

  private addListeners() {

    this.client.once("clientReady", async () => {
      console.log(`Bot is online as ${this.client.user?.tag}`);
    });
      
    this.client.on("guildCreate", async (guild) => {

      await deployCommands({ guildId: guild.id });
      console.log(`Deployed commands to new guild: ${guild.name}`);
    });

    this.client.on("interactionCreate", async (interaction: Interaction) => {
      await listener(interaction);
    })
  }

  public async start() {
    await this.client.login(config.BOT_TOKEN);
    console.log("client logged in");
  }
}