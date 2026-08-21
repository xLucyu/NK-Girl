export function splitUppercase(value: string): string {

  const specialCases: Record<string, string> = {
    Tutorial: "Monkey Meadows",
    Clicks: "Chimps",
    AlternateBloonsRounds: "ABR",
    "#ouch": "#ouch"
    };

  if (value in specialCases) return specialCases[value];

  const split = value.match(/[A-Z][a-z]*/g) ?? [];
  return split.join(" ");
}

export function splitBossNumbers(value: string): string {

  const match = value.match(/(\D*)(\d*)/);
  if (!match) throw new Error();

  const [, name, number] = match;
  return `${name} #${number}`;
}

export function convertCash(value: number): string {
  return `$ ${value.toLocaleString("en-US")}`;
}

export function msToTimeFormat(ms: number): string {

  if (!Number.isFinite(ms) || ms < 0) return "—";

  let adjustedMs = Math.floor(ms);

  const hundredths = Math.floor(adjustedMs / 10) % 100;

  if ([2, 4, 7, 9].includes(hundredths % 10)) {
    adjustedMs -= 10;
  }

  const hours = Math.floor(adjustedMs / 3_600_000);
  const minutes = Math.floor((adjustedMs % 3_600_000) / 60_000);
  const seconds = Math.floor((adjustedMs % 60_000) / 1000);
  const millis = adjustedMs % 1000;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const mmm = String(millis).padStart(3, "0");

  return hours > 0
    ? `${hours}:${mm}:${ss}.${mmm}`
    : `${minutes}:${ss}.${mmm}`;
}