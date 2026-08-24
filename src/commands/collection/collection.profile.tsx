import { 
  EventBody, 
  EventType, 
  InstaSchedule 
} from "@btd6";
import { Event, Layout, Rotation } from "@ui";


const PAGE_SIZE = 10;

export interface CollectionProfileProps {
  event: EventBody;
  metaData: InstaSchedule;
  offset: number;
}

function toRotationList(rotations: InstaSchedule["Rotations"]): Rotation[] {
  return Object.entries(rotations)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([, r]) => ({
      instas: r.Instas,
      timeStamp: r.TimeStamp,
    }));
}

function getNextRotation(list: Rotation[]): Rotation | null {
  const now = Date.now();
  return list.find((r) => new Date(r.timeStamp).getTime() > now) ?? null;
}

function formatCountdown(target: Date): string {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return "now";

  const totalMinutes = Math.floor(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return `${days}d ${remHours}h`;
  }
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function CollectionProfile({
  event,
  metaData,
  offset,
}: CollectionProfileProps): JSX.Element {

  const allRotations = toRotationList(metaData.Rotations);
  const maxOffset = Math.max(
    0,
    (Math.ceil(allRotations.length / PAGE_SIZE) - 1) * PAGE_SIZE
  );

  const safeOffset = Math.min(
    Math.max(0, offset),
    maxOffset
  );

  // 10 per page, laid out as two columns of 5 inside a single box.
  const pageRotations = allRotations.slice(safeOffset, safeOffset + PAGE_SIZE);

  const next = getNextRotation(allRotations);

  const infoItems = [
    { label: "Start", value: new Date(metaData.Start).toLocaleDateString("en-GB") },
    { label: "End", value: new Date(metaData.End).toLocaleDateString("en-GB") },
    { label: "Rotations", value: allRotations.length },
    { label: "Next Rotation", value: next ? formatCountdown(new Date(next.timeStamp)) : "—" },
  ];

  return (
    <Layout.Container>
      <Event.Header
        eventType={EventType.Collection}
        eventName={event.name}
        difficulty="Insta Rotations"
      />

      <Layout.Row>
        <Layout.Column flex={1}>
          <Event.Info items={infoItems} />
          <Event.Bar start={event.start} end={event.end} />
        </Layout.Column>
      </Layout.Row>

      <Layout.Row style={{ flex: 1 }}>
          <Event.Rotations
            rotations={pageRotations}
            allRotations={allRotations}
            columns={2}
          />
      </Layout.Row>
    </Layout.Container>
  );
}
