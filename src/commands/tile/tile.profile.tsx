import { CTBody, TileCode } from "@utils"

interface CtProps {
  event: CTBody;
  tile: TileCode;
}

export function CtProfile({ event, tile }: CtProps): JSX.Element {

  console.log(tile);

  return (
  <div>
    hello
  </div>
  )
}
