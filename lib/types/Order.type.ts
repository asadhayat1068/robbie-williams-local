export type Order = {
  id: string; // External OrderId from eventbrite API
  userId: string; // FK to User model
  eventId: string; // External EventID from eventbrite API
};
