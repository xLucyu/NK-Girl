import { 
  AutocompleteInteraction, 
  ChatInputCommandInteraction, 
  ModalBuilder, 
  SlashCommandOptionsOnlyBuilder, 
  SlashCommandSubcommandsOnlyBuilder 
} from "discord.js";
import type { InteractionType } from "../commands/base.command";
import type { ComponentState } from "@components";

export interface Command {
  commandData: SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
  autoComplete?(interaction: AutocompleteInteraction): Promise<void>;
  renderAndReply?(interaction: InteractionType, state: ComponentState): Promise<void>;
  handleModal?(state: ComponentState, key: string, input: string): boolean;
  buildModal?(key: string): ModalBuilder | null;
}

class CommandRegistry {

  private commands = new Map<string, Command>();

  public register(commands: Command[]): void {
    for (const command of commands) {
      const name = command.commandData.name;
      if (this.commands.has(name)) throw new Error(`duplicate name for ${name}`);
      this.commands.set(name, command);
    }
  }

  public get(name: string): Command {
    const command = this.commands.get(name);
    if (!command) throw new Error("Command doesnt exist");
    return command
  }

  public all(): Command[] {
    return [...this.commands.values()];
  }
}

export const registry = new CommandRegistry();
