// Event envelopes coming from other services via Kafka.

export type UserEventType = "UserRegistered";
export type TicketEventType = "TICKET_BOOKED" | "TICKET_RESERVED" | "TICKET_CONFIRMED" | "TICKET_CANCELLED";
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

// Ticketing events - matching ticketing service event types
export interface TicketBookedPayload {
  bookingId: string;
  userId: string;
  routeId: string;
  scheduleId: string;
  seatNumber?: string | null;
  passengerName: string;
  passengerEmail: string;
  price: number;
  currency: string;
}

export interface TicketReservedPayload {
  bookingId: string;
  userId: string;
  routeId: string;
  scheduleId: string;
  seatNumber?: string | null;
  passengerName: string;
  passengerEmail: string;
  price: number;
  currency: string;
  expiresAt: string;
}

export interface TicketConfirmedPayload {
  bookingId: string;
  userId: string;
  paymentId: string;
  confirmedAt: string;
}

export interface TicketCancelledPayload {
  bookingId: string;
  userId: string;
  reason?: string;
  cancelledAt: string;
  refundAmount?: number;
}

export type TicketEvent =
  | BaseEvent<"TICKET_BOOKED", TicketBookedPayload>
  | BaseEvent<"TICKET_RESERVED", TicketReservedPayload>
  | BaseEvent<"TICKET_CONFIRMED", TicketConfirmedPayload>
  | BaseEvent<"TICKET_CANCELLED", TicketCancelledPayload>;

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


