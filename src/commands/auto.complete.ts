import { gsc } from "@manager";
import { EventType, splitUppercase } from "@utils";

type EventAutocompleteEntry = {
  id: string;
  name: string;
  search: string;
};

type AutocompleteChoice = {
  name: string;
  value: string;
};

type CacheEntry = {
  entries: EventAutocompleteEntry[];
  lastFetch: number;
};

const MAX_CHOICE_LENGTH = 100;
const MAX_CHOICES = 25;
const CACHE_TIME = 1000 * 60 * 10;

const cache = new Map<EventType, CacheEntry>();

const formatEventName = (id: string): string => {
  const cleanedId = id.replaceAll("_", " ").trim();

  const match = cleanedId.match(/^(.+?)(\d+)$/u);

  if (!match) {
    return splitUppercase(cleanedId).trim();
  }

  const [, name, number] = match;

  return `${splitUppercase(name).trim()} ${number}`;
};

export async function getEventAutocompleteEntries(eventType: EventType): Promise<EventAutocompleteEntry[]> {

  const cached = cache.get(eventType);

  if (cached && Date.now() - cached.lastFetch < CACHE_TIME) {
    return cached.entries;
  }

  const ids = await gsc.getEventIds(eventType);

  const entries = ids
    .filter((id) => id.trim().length > 0)
    .map((id) => {
      const name = formatEventName(id);

      return {
        id,
        name,
        search: `${id} ${name}`.toLowerCase(),
      };
    });

  cache.set(eventType, {
    entries,
    lastFetch: Date.now(),
  });

  return entries;
}

export async function getEventAutocompleteChoices(eventType: EventType,focused: string): Promise<AutocompleteChoice[]> {

  const entries = await getEventAutocompleteEntries(eventType);
  const search = focused.toLowerCase().trim();

  const toChoice = (entry: EventAutocompleteEntry): AutocompleteChoice | null => {
    const value = entry.id.trim();

    if (value.length === 0 || value.length > MAX_CHOICE_LENGTH) return null;
    
    const name = entry.name.trim() || value || "Unknown";

    return {
      name: name.slice(0, MAX_CHOICE_LENGTH),
      value,
    };
  };

  return entries
    .filter((entry) => !search || entry.search.includes(search))
    .map(toChoice)
    .filter((choice): choice is AutocompleteChoice => choice !== null)
    .slice(0, MAX_CHOICES);
}

export function clearEventAutocompleteCache(eventType?: EventType): void {
  if (eventType) {
    cache.delete(eventType);
    return;
  }

  cache.clear();
}