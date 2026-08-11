import { Header } from "./Header"
import { Info } from "./Info"
import { MapSection} from "./Map"
import { ProgressBar } from "./ProgressBar"
import { Modifiers } from "./Modifiers";
import { 
  Towers,
  Rotations, 
  Rotation, 
  TowerIcon } from "./towers";

export const Event = {
  Header: Header,
  Info: Info,
  Map: MapSection,
  Bar: ProgressBar,
  Modifiers: Modifiers,
  Towers: Towers,
  Rotations: Rotations,
  TowerIcon: TowerIcon
}

export type { Rotation };
