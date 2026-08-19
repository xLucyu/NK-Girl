export interface RotationPage {
  Instas: string[];
  TimeStamp: string;
}

export interface InstaSchedule {
  Start: string;
  End: string;
  Rotations: Record<number, RotationPage>;
}

export interface CollectionEventData {
  id: string;
  start: number;
  end: number;
}