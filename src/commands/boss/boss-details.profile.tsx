import { Layout, Options } from "@components";
import { BossBody, MetaBody } from "@utils";

interface BossDetailsProfileProps {
  event: BossBody;
  metaData: MetaBody;
  options: Options;
}

export function BossDetailsProfile({ event, metaData, options }: BossDetailsProfileProps): JSX.Element {
  return (
    <Layout.Container>
      hello
    </Layout.Container>
  )
}