import { 
  ChatInputCommandInteraction, 
  InteractionReplyOptions, 
  SlashCommandBuilder 
} from "discord.js";
import { BaseCommand } from "@commands/base.btd6-command";
import { BaseOptions, BuildSelectMenu, Command, ComponentState } from "@discord";
import { 
  CTBody, 
  CurrentEventData, 
  EventCacheEntry, 
  EventType, 
  TileCode 
} from "@btd6";
import { TileProfile } from "./tile.profile";
import { TileNotFound } from "@lib";


interface TileOptions extends BaseOptions {
  tileCode: string;
}

type TileCache = Record<string, TileCode>;
type TileProps = EventCacheEntry<CTBody, TileCache>;

const bannerEmojis: Record<number, string> = {
  2: "Race",
  4: "BossChallenge",
  8: "LeastTiers",
  9: "LeastCash"
}

@Command({
  description: "Show Tile Data from Contested Territory",
  autoComplete: false
})
export class TileCommand extends BaseCommand<CTBody, TileCache> {

  protected readonly eventType = EventType.CT;
  protected readonly urlKey = EventType.CT;

  public commandData = new SlashCommandBuilder()
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

    if (!tileCode) throw new TileNotFound();

    const event = props.data;
    const tile = props.metaData[tileCode];

    return TileProfile({
      event,
      tile
    })
  }

  protected getOptions(interaction: ChatInputCommandInteraction): TileOptions {
    return {
      tileCode: interaction.options.getString("tile_code", true).toUpperCase()
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

    const getBannerEmoji = (tile: TileCode): string => {
      return bannerEmojis[tile.GameData.subGameType];
    }

    return [
      BuildSelectMenu({
        customId: "tile:tileCode:banner",
        placeholder: "Select a Banner",
        options: banners.slice(0, 25).map((tile) => ({
          label: tile.Code,
          value: tile.Code,
          default: tile.Code === state.options.tileCode,
          emoji: getBannerEmoji(tile)
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
