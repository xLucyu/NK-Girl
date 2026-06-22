import { JSX } from "react";
import { MetaBody, RaceBody } from "@utils";
import { Container, Header } from "@components";

export interface RaceProfileProps {
    event: RaceBody;
    metaData: MetaBody;
}

export function RaceProfile({ event, metaData }: RaceProfileProps): JSX.Element {

  return (
    <Container background="#0e3f78">
      <Header mode="Race" name={event.name} />
    </Container>
  );
}
