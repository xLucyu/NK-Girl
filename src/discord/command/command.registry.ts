import {
  ApplicationIntegrationType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  InteractionContextType,
  ModalBuilder,
  ModalSubmitInteraction,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import { CommandMetadata, getCommandMetadata } from "./command.decorator";
import { InteractionType } from "@discord/component/handlers/interaction.handler";
import { CurrentEventData } from "@btd6/cache/events";
import type { ComponentState } from "@discord/component/handlers/component.state";
import { Announcement } from "@btd6/services";

export interface CommandInterface {
  commandData: SlashCommandOptionsOnlyBuilder;
  metadata: CommandMetadata;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
  autoComplete?(interaction: AutocompleteInteraction): Promise<void>;
  renderAndReply?(interaction: InteractionType, state: ComponentState): Promise<void>;
  handleModal?(interaction: ModalSubmitInteraction): Promise<void>;
  buildModal?(key: string): ModalBuilder | null;
  buildAnnouncement?(event: CurrentEventData<any, any>): Announcement | null;
}

class CommandRegistry {

  private commands = new Map<string, CommandInterface>();

  public register(commands: CommandInterface[]): void {

    for (const command of commands) {

      const metadata = getCommandMetadata(command);
      command.metadata = metadata;

      command.commandData
        .setName(metadata.name)
        .setDescription(metadata.description);

      const integrations: ApplicationIntegrationType[] = [];
      const contexts: InteractionContextType[] = [];

      if (metadata.guildInstall) {
        integrations.push(ApplicationIntegrationType.GuildInstall);
        contexts.push(InteractionContextType.Guild);
      }

      if (metadata.userInstall) {
        integrations.push(ApplicationIntegrationType.UserInstall);
        contexts.push(InteractionContextType.PrivateChannel);
      }

      command.commandData
        .setIntegrationTypes(...integrations)
        .setContexts(...contexts);

      if (metadata.autoComplete) {

        command.commandData
          .addStringOption((option) =>
            option
              .setName(`${metadata.name}_id`)
              .setDescription(`Look up previous ${metadata.name} events`)
              .setAutocomplete(true)
              .setRequired(false)
          )
      }

      if (this.commands.has(metadata.name)) throw new Error(`duplicate name for ${metadata.name}`);

      this.commands.set(metadata.name, command);
    }
  }

  public get(name: string): CommandInterface {
    const command = this.commands.get(name);
    if (!command) throw new Error("Command doesnt exist");
    return command
  }

  public all(): CommandInterface[] {
    return [...this.commands.values()];
  }
}

export const registry = new CommandRegistry();