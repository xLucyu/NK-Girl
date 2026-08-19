export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function addUnderscore(value: string): string {
  return value.replace(/ /g, "_");
}
