import { ChatInputCommandInteraction, InteractionReplyOptions } from "discord.js";
import { EventCacheEntry } from "@manager";
import { CTBody, EventType, TileCode } from "@utils";
import { BuildSelectMenu, ComponentState, Options } from "@components";
import { BaseCommand } from "../base.command";
import { CtProfile } from "./ct.profile";

type CtCache = Record<string, TileCode>;
type CtProps = EventCacheEntry<CTBody, CtCache>;

export class CTCommand extends BaseCommand<CTBody, CtCache> {

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

  public getProfile(props: CtProps["currentEvent"], state: ComponentState): JSX.Element {

    const tileCode = state.options.tileCode;

    if (!tileCode) throw new Error();

    const event = props.data;
    const tile = props.metaData[tileCode];

    return CtProfile({
      event,
      tile
    })
  }

  protected getOptions(interaction: ChatInputCommandInteraction): Options {
    return {
      tileCode: interaction.options.getString("tile_code", true).toLocaleUpperCase()
    };
  }

  protected getComponents(eventProps: CtProps, state: ComponentState): InteractionReplyOptions["components"] {

    const tiles = Object.values(eventProps.currentEvent.metaData);

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
          default: tile.Code === state.options.tileCode
        }))
      })
    ]
  }
}
