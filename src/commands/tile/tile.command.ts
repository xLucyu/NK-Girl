import { ChatInputCommandInteraction, InteractionReplyOptions } from "discord.js";
import { BaseCommand } from "../base.command";
import { TileProfile } from "./tile.profile";
import type { CurrentEventData, EventCacheEntry } from "@manager";
import { 
  type CTBody, 
  EventType, 
  type TileCode 
} from "@utils";
import { BuildSelectMenu, ComponentState, BaseOptions } from "@components";

interface TileOptions extends BaseOptions {
  tileCode: string;
}

type TileCache = Record<string, TileCode>;
type TileProps = EventCacheEntry<CTBody, TileCache>;

export class TileCommand extends BaseCommand<CTBody, TileCache> {

  protected readonly eventType = EventType.CT;
  protected readonly urlKey = EventType.CT;

  public commandData = BaseCommand
    .baseSlashCommand("tile", "Show CT Tile Data.", false)
    .addStringOption((option) =>
      option 
        .setName("tile_code")
        .setDescription("Tile Code.")
        .setRequired(true)
        .setMinLength(3)
        .setMaxLength(3)     
  );

  public getProfile(props: TileProps["currentEvent"], state: ComponentState): JSX.Element {

    const tileCode = state.options.tileCode as string;

    if (!tileCode) throw new Error();

    const event = props.data;
    const tile = props.metaData[tileCode];

    return TileProfile({
      event,
      tile
    })
  }

  protected getOptions(interaction: ChatInputCommandInteraction): TileOptions {
    return {
      tileCode: interaction.options.getString("tile_code", true).toLocaleUpperCase()
    };
  }

  protected getIdentity(data: CTBody): string {
    return data.id;
  }

  protected getComponents(
    event: CurrentEventData<CTBody, TileCache>,
    state: ComponentState
  ): InteractionReplyOptions["components"] {

    const tiles = Object.values(event.metaData);

    const banners = tiles.filter((tile) => tile.TileType === "Banner");
    const relics = tiles.filter((tile) => tile.TileType === "Relic");

    return [
      BuildSelectMenu({
        customId: "tile:tileCode:banner",
        placeholder: "Select a Banner",
        options: banners.slice(0, 25).map((tile) => ({
          label: tile.Code,
          value: tile.Code,
          default: tile.Code === state.options.tileCode
        }))
      }),

      BuildSelectMenu({
        customId: "tile:tileCode:relic", 
        placeholder: "Select a Relic",
        options: relics.slice(0, 25).map((tile) => ({
          label: tile.Code,
          value: tile.Code,
          default: tile.Code === state.options.tileCode,
          emoji: tile.RelicType
        })),
      }),
    ];
  }
}
