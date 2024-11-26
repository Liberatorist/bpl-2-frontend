import type { Team } from "../types/team";
import type { BPLEvent, EventCreate, EventUpdate } from "../types/event";
import { fetchWrapper } from "./base";

export class HttpError {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}

export async function fetchAllEvents(): Promise<BPLEvent[]> {
  return await fetchWrapper<BPLEvent[]>("/events", "GET");
}

export async function createEvent(data: Partial<BPLEvent>, token: string) {
  if (data.name === undefined) {
    return;
  }
  const body: EventCreate = {
    name: data.name,
    is_current: data.is_current || false,
  };

  return await fetchWrapper<BPLEvent>("/events", "POST", token, body);
}

export async function updateEvent(data: Partial<BPLEvent>, token: string) {
  if (data.id === undefined) {
    throw Error;
  }

  const body: EventUpdate = {};
  if (data.name !== undefined) {
    body.name = data.name;
  }
  if (data.is_current !== undefined) {
    body.is_current = data.is_current;
  }
  console.log(data);
  console.log(body);
  return await fetchWrapper<BPLEvent>(
    "/events/" + data.id,
    "PATCH",
    token,
    body
  );
}

export async function deleteEvent(data: Partial<BPLEvent>, token: string) {
  if (data.id === undefined) {
    throw Error;
  }
  return await fetchWrapper<null>("/events/" + data.id, "DELETE", token);
}