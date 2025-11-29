// Event envelopes coming from other services via Kafka.

export type UserEventType = "UserRegistered";
export type TicketEventType = "TicketBooked" | "TicketCancelled";
export type PaymentEventType = "PaymentCompleted" | "PaymentFailed";
export type WalletEventType = "WalletTopupCompleted" | "WalletDebited" | "WalletCredited";

export interface BaseEvent<TType extends string, TPayload> {
  eventId: string;
  type: TType;
  occurredAt: string;
  payload: TPayload;
}

// User events
export interface UserRegisteredPayload {
  userId: string;
  email: string;
  name?: string;
}

export type UserEvent = BaseEvent<UserEventType, UserRegisteredPayload>;

// Ticketing events
export interface TicketBookedPayload {
  ticketId: string;
  userId: string;
  routeId: string;
  scheduleId: string;
  price: number;
}

export interface TicketCancelledPayload {
  ticketId: string;
  userId: string;
  reason?: string;
}

export type TicketEvent =
  | BaseEvent<"TicketBooked", TicketBookedPayload>
  | BaseEvent<"TicketCancelled", TicketCancelledPayload>;

// Payment events
export interface PaymentCompletedPayload {
  paymentId: string;
  userId: string;
  bookingId: string;
  amount: number;
}

export interface PaymentFailedPayload {
  paymentId: string;
  userId: string;
  bookingId: string;
  amount: number;
  reason: string;
}

export type PaymentEvent =
  | BaseEvent<"PaymentCompleted", PaymentCompletedPayload>
  | BaseEvent<"PaymentFailed", PaymentFailedPayload>;

// Wallet events
export interface WalletTopupCompletedPayload {
  transactionId: string;
  userId: string;
  amount: number;
}

export interface WalletDebitedPayload {
  transactionId: string;
  userId: string;
  amount: number;
}

export interface WalletCreditedPayload {
  transactionId: string;
  userId: string;
  amount: number;
}

export type WalletEvent =
  | BaseEvent<"WalletTopupCompleted", WalletTopupCompletedPayload>
  | BaseEvent<"WalletDebited", WalletDebitedPayload>
  | BaseEvent<"WalletCredited", WalletCreditedPayload>;

export type AnyDomainEvent = UserEvent | TicketEvent | PaymentEvent | WalletEvent;


