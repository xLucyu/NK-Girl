import { 
  Client, 
  GatewayIntentBits, 
  Interaction, 
  Partials 
} from "discord.js";
import { config } from "./config"; 
import { deployCommands } from "./deploy.commands";
import { listener } from "./listeners/interaction";
import { eventManager } from "./event.manager/manager";

export class DiscordClient {

  private client: Client;

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

const discordClient = new DiscordClient();
discordClient.start();
discordClient.startEventManager();
