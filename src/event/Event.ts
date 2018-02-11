export type EventType = string;

export const MODEL_UPDATED = 'model-updated';

export interface BaseEvent<P> {
  type: EventType;
  payload: P;
}
