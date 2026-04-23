export function getNumberForEvent(eventStart: number, mode: string): number | null {

  const eventsByFirstTimeStampAndDuration: Record<string, [number, number]> = {
        Race: [1544601600000, 7],
        Standard: [1533974400000, 1],
        Advanced: [1535097600000, 1],
        CT: [1660082400000, 14],
        Odyssey: [1593532800000, 7],
  };

  if (!(mode in eventsByFirstTimeStampAndDuration)) {
    return null;
  }

  const [firstTimeStamp, duration] = eventsByFirstTimeStampAndDuration[mode];
  const timeDifference = eventStart - firstTimeStamp;
  const calculateNumber = Math.floor(
    timeDifference / (duration * 24 * 60 * 60 * 1000)
  );

  return calculateNumber;
}
