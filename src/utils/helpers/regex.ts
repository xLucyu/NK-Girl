export function splitUppercase(value: string): string {

    const specialCases: Record<string, string> = {
        Tutorial: "Monkey Meadows",
        Clicks: "Chimps",
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