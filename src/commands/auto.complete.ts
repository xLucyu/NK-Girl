import { BucketRoot, gsc } from "@manager";
import { EventType, splitUppercase } from "@utils";

type AutocompleteChoice = {
  name: string;
  value: string;
};

const MAX_CHOICE_LENGTH = 100;
const MAX_CHOICES = 25;

const formatEventName = (id: string): string => {
  
  const cleanedId = id.replaceAll("_", " ").trim();

  const match = cleanedId.match(/^(.+?)(\d+)$/u);

  if (!match) {
    return splitUppercase(cleanedId).trim() || cleanedId;
  }

  const [, rawName, number] = match;

  const formattedName =
    splitUppercase(rawName).trim() || rawName.trim();

  return `${formattedName} ${number}`;
};

export async function getEventAutocompleteChoices(
  eventType: EventType, 
  focused: string,
  root: BucketRoot = "Event"
): Promise<AutocompleteChoice[]> {

  const search = focused.toLowerCase().trim();
  const ids = await gsc.getEventIds(eventType, { root });

  return ids
    .map((id) => {
      const value = id.trim();

      if (value.length === 0 || value.length > MAX_CHOICE_LENGTH) return null;
      
      const name = formatEventName(value) || value;

      return {
        name: name.slice(0, MAX_CHOICE_LENGTH),
        value,
        search: `${value} ${name}`.toLowerCase(),
      };
    })
    .filter((entry): entry is AutocompleteChoice & { search: string } => entry !== null)
    .filter((entry) => !search || entry.search.includes(search))
    .slice(0, MAX_CHOICES)
    .map(({ name, value }) => ({
      name,
      value,
    }));
}
