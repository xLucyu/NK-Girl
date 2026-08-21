export interface CommandOptions {
  name?: string;
  description: string;
  cooldown?: number;
  guildInstall?: boolean;
  userInstall?: boolean;
  usage?: boolean;
  autoComplete?: boolean;
}

export interface CommandMetadata {
  name: string;
  description: string;
  cooldown: number;
  guildInstall: boolean;
  userInstall: boolean;
  usage: boolean;
  autoComplete: boolean;
}

const COMMAND_METADATA = Symbol("commandMetadata");

type CommandClass = (new (...args: any[]) => any) & { name: string };

export const commandClasses = new Set<CommandClass>();

export function Command(options: CommandOptions) {

  return function<T extends CommandClass>(target: T) {

    const inherited = target.prototype[COMMAND_METADATA] as CommandMetadata | undefined;

    const metadata: CommandMetadata = {
      ...inherited,
      name: options.name ?? getCommandName(target.name),
      description: options.description,
      cooldown: options.cooldown ?? inherited?.cooldown ?? 5000,
      guildInstall: options.guildInstall ?? inherited?.guildInstall ?? true,
      userInstall: options.userInstall ?? inherited?.userInstall ?? true,
      usage: options.usage ?? inherited?.usage ?? true,
      autoComplete: options.autoComplete ?? inherited?.autoComplete ?? false
    };

    Object.defineProperty(
      target.prototype,
      COMMAND_METADATA,
      {
        value: metadata,
        enumerable: false,
        configurable: false,
        writable: false
      }
    );

    commandClasses.add(target);
  };
}

export function getCommandMetadata(target: object): CommandMetadata {

  const metadata = (target as any)[COMMAND_METADATA] as CommandMetadata;

  if (!metadata) throw new Error(`Missing @Command decorator on ${target.constructor.name}`);
  return metadata;
}

function getCommandName(name: string): string {

  return name
    .replace(/Command$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase();
}