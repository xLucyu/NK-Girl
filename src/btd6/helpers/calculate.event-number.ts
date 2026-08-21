interface EventTimeConfig {
  mode: string;
  firstEvent: number;
  duration: number;
}

const eventsTimeStamps: EventTimeConfig[] = [
  { mode: "Race", firstEvent: 1544601600000, duration: 7 },
  { mode: "Standard",firstEvent: 1533974400000, duration: 1 },
  { mode: "Advanced", firstEvent: 1535097600000, duration: 1 },
  { mode: "CT", firstEvent: 1660082400000, duration: 14 },
  { mode: "BossRush", firstEvent: 1712786400000, duration: 14 },
  { mode: "Odyssey", firstEvent: 1593532800000, duration: 7 }
];

export function getNumberForEvent(eventStart: number, mode: string): number {

  const selectedEvent = eventsTimeStamps.find((event) => event.mode === mode)!; // will always be found

  const timeDifference = eventStart - selectedEvent.firstEvent;
  const calculate = Math.floor(timeDifference / (selectedEvent.duration * 24 * 60 * 60 * 1000));
  return Math.max(0, calculate);
}