export interface EventBody {
  id: string;
  type: string;
  name: string;
  start: number;
  end: number;
  url?: string | null;
}

export interface Events {
  success: boolean;
  body: EventBody[];
}
