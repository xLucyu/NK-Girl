import { getDisabledTowers } from "@btd6/helpers/towers";
import type { Tower } from "@btd6/types";
import { Layout } from "../layout";
import { Header } from "./Header";
import { Towers } from "./towers";

interface DisabledTowersProfileProps {
  eventType: string;
  eventName: string;
  difficulty?: string;
  towers: Tower[] | null | undefined;
}

export function DisabledTowersProfile({
  eventType,
  eventName,
  difficulty,
  towers
}: DisabledTowersProfileProps): JSX.Element {

  const disabled = towers == null ? null : getDisabledTowers(towers);
  const count = disabled
    ? Object.values(disabled).reduce((total, entries) => total + entries.length, 0)
    : 0;

  return (
    <Layout.Container>
      <Header eventType={eventType} eventName={eventName} difficulty={difficulty} />
      <Layout.Column style={{ alignItems: "center", flex: 1, paddingTop: 24, gap: 18 }}>
        <span style={{ color: "white", fontSize: 30, letterSpacing: 2 }}>
          DISABLED TOWERS
        </span>
        {disabled && count > 0 ? (
          <Towers towers={disabled} blocked />
        ) : (
          <span style={{ color: "white", fontSize: 24 }}>
            {disabled ? "No towers are disabled." : "Tower restrictions are unavailable."}
          </span>
        )}
      </Layout.Column>
    </Layout.Container>
  );
}
