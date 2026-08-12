import {
  ABR,
  REGULAR,
  EndRoundOutOfBounds,
  GoalTimeTooLow,
  InvalidStartRound,
  InvalidTimeFormat,
  StartRoundOutOfBounds,
  msToTimeFormat,
} from "@utils";

export interface TimeCalculation {
  title: string;
  startRound: number;
  endRound: number;
  longestRound: number;
  roundSet: string;
  inputLabel: string;
  inputTime: string;
  calculatedTime: string;
  laterRounds: string[];
}

function parseTime(value: string): number {

  const time = value.trim();

  let match = time.match(/^(\d+):(\d{1,2})(?:\.(\d{1,3}))?$/);

  if (match) {
    const minutes = Number(match[1]);
    const seconds = Number(match[2]);
    const fraction = match[3] ?? "0";

    const milliseconds = Number(fraction.padEnd(3, "0"));

    return minutes * 60_000 + seconds * 1000 + milliseconds;
  }

  match = time.match(/^(\d+)(?:\.(\d{1,3}))?$/);

  if (!match) throw new InvalidTimeFormat();

  const seconds = Number(match[1]);
  const fraction = match[2] ?? "0";

  const milliseconds = Number(fraction.padEnd(3, "0"));

  return seconds * 1000 + milliseconds;
}

function validateRounds(startRound: number, endRound: number): void {

  if (startRound >= endRound) throw new InvalidStartRound();
  if (startRound < 0 || startRound > 139) throw new StartRoundOutOfBounds();
  if (endRound < 1 || endRound > 140) throw new EndRoundOutOfBounds();
}

function getRounds(abr: boolean): number[] {
  return abr ? ABR : REGULAR;
}

function getLongestRound(
  rounds: number[],
  startRound: number,
  endRound: number
): number {

  let longestRound = startRound;

  for (let round = startRound + 1; round <= endRound; round++) {
    if (rounds[round] > rounds[longestRound]) longestRound = round;
  }

  return longestRound;
}

function calculateSendingTime(
  longestRound: number,
  startRound: number,
  longestRoundInSeconds: number,
  extraTime = 0
): number {

  const offRound = startRound === 0 ? 1 : 0;

  const roundSendDelay = (longestRound - startRound - offRound) * 200;
  const roundDuration = (Math.ceil(longestRoundInSeconds * 60) + 1) / 60 * 1000;

  return roundSendDelay + roundDuration + extraTime;
}

function getLaterRounds(
  rounds: number[],
  longestRound: number,
  specialTime: number,
  endRound: number
): string[] {

  const laterRounds: string[] = [];

  let currentRound = longestRound;

  while (currentRound < endRound) {

    const startRound = currentRound + 1;

    let nextLongestRound = startRound;
    let longestTime = -Infinity;

    for (let round = startRound; round <= endRound; round++) {

      const time = rounds[round] + (round - startRound) * 0.2;

      if (time > longestTime) {
        longestTime = time;
        nextLongestRound = round;
      }
    }

    const rawLength = rounds[nextLongestRound] * 1000;
    const delay = 200 * (nextLongestRound - currentRound);
    const sendingTime = specialTime - rawLength - delay;

    currentRound = nextLongestRound;

    laterRounds.push(
      `Send Round **${currentRound}** before **${msToTimeFormat(sendingTime)}**`
    );
  }

  return laterRounds;
}

export function calculateSend(
  startRound: number,
  endRound: number,
  time: string,
  abr: boolean
): TimeCalculation {

  validateRounds(startRound, endRound);

  const timeInMs = parseTime(time);
  const rounds = getRounds(abr);

  const longestRound = getLongestRound(
    rounds,
    startRound,
    endRound
  );

  const longestRoundInSeconds = rounds[longestRound];

  const calculatedTime = calculateSendingTime(
    longestRound,
    startRound,
    longestRoundInSeconds,
    timeInMs
  );

  return {
    title: "Race Time Calculator",
    startRound,
    endRound,
    longestRound,
    roundSet: abr ? "ABR" : "Regular",
    inputLabel: "Sending Time",
    inputTime: msToTimeFormat(timeInMs),
    calculatedTime: `You will get **${msToTimeFormat(calculatedTime)}** if you perfectly clean round **${longestRound}**.`,
    laterRounds: getLaterRounds(
      rounds,
      longestRound,
      calculatedTime,
      endRound
    )
  };
}

export function calculateGoal(
  startRound: number,
  endRound: number,
  goalTime: string,
  abr: boolean
): TimeCalculation {

  validateRounds(startRound, endRound);

  const timeInMs = parseTime(goalTime);
  const rounds = getRounds(abr);

  const longestRound = getLongestRound(
    rounds,
    startRound,
    endRound
  );

  const longestRoundInSeconds = rounds[longestRound];

  if (longestRoundInSeconds * 1000 > timeInMs) {
    throw new GoalTimeTooLow();
  }

  const sendingTime = calculateSendingTime(
    longestRound,
    startRound,
    longestRoundInSeconds
  );

  const calculatedTime = timeInMs - sendingTime;

  return {
    title: "Goal Time Calculator",
    startRound,
    endRound,
    longestRound,
    roundSet: abr ? "ABR" : "Regular",
    inputLabel: "Goal Time",
    inputTime: msToTimeFormat(timeInMs),
    calculatedTime: `To get **${msToTimeFormat(timeInMs)}** you have to send to round **${longestRound}** at **${msToTimeFormat(calculatedTime)}**, assuming you perfectly clean.`,
    laterRounds: getLaterRounds(
      rounds,
      longestRound,
      timeInMs,
      endRound
    )
  };
}
