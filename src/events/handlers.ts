import { v4 as uuidv4 } from "uuid";
import {
  AnyDomainEvent,
  PaymentEvent,
  TicketEvent,
  UserEvent,
  WalletEvent
} from "./types";
import {
  Notification,
  NotificationChannel,
  addNotification
} from "../models/Notification";
import { sendEmail } from "../channels/emailChannel";
import { sendSms } from "../channels/smsChannel";
import { sendPush } from "../channels/pushChannel";

function buildNotification(
  userId: string | null,
  channel: NotificationChannel,
  subject: string,
  content: string
): Notification {
  return {
    id: uuidv4(),
    userId,
    channel,
    subject,
    content,
    status: "PENDING",
    createdAt: new Date()
  };
}

async function dispatchNotification(notification: Notification): Promise<void> {
  addNotification(notification);

  try {
    if (notification.channel === "EMAIL") {
      await sendEmail(notification);
    } else if (notification.channel === "SMS") {
      await sendSms(notification);
    } else if (notification.channel === "PUSH") {
      await sendPush(notification);
    }
    notification.status = "SENT";
  } catch (err) {
    notification.status = "FAILED";
    // eslint-disable-next-line no-console
    console.error("Failed to send notification", err);
  }
}

async function handleUserEvent(event: UserEvent): Promise<void> {
  if (event.type === "UserRegistered") {
    const notification = buildNotification(
      event.payload.userId,
      "EMAIL",
      "Welcome to SC MTP",
      `Hi ${event.payload.name || "there"}, your account has been created successfully.`
    );
    await dispatchNotification(notification);
  }
}

async function handleTicketEvent(event: TicketEvent): Promise<void> {
  if (event.type === "TicketBooked") {
    const notification = buildNotification(
      event.payload.userId,
      "PUSH",
      "Ticket booked",
      `Your ticket ${event.payload.ticketId} has been booked for route ${event.payload.routeId}.`
    );
    await dispatchNotification(notification);
  } else if (event.type === "TicketCancelled") {
    const notification = buildNotification(
      event.payload.userId,
      "PUSH",
      "Ticket cancelled",
      `Your ticket ${event.payload.ticketId} has been cancelled. ${event.payload.reason || ""}`
    );
    await dispatchNotification(notification);
  }
}

async function handlePaymentEvent(event: PaymentEvent): Promise<void> {
  if (event.type === "PaymentCompleted") {
    const notification = buildNotification(
      event.payload.userId,
      "EMAIL",
      "Payment successful",
      `Payment ${event.payload.paymentId} of amount ${event.payload.amount} was successful.`
    );
    await dispatchNotification(notification);
  } else if (event.type === "PaymentFailed") {
    const notification = buildNotification(
      event.payload.userId,
      "EMAIL",
      "Payment failed",
      `Payment ${event.payload.paymentId} failed: ${event.payload.reason}.`
    );
    await dispatchNotification(notification);
  }
}

async function handleWalletEvent(event: WalletEvent): Promise<void> {
  switch (event.type) {
    case "WalletTopupCompleted": {
      const notification = buildNotification(
        event.payload.userId,
        "PUSH",
        "Wallet topped up",
        `Your wallet has been topped up with ${event.payload.amount}.`
      );
      await dispatchNotification(notification);
      break;
    }
    case "WalletDebited": {
      const notification = buildNotification(
        event.payload.userId,
        "PUSH",
        "Wallet debited",
        `Your wallet has been debited by ${event.payload.amount}.`
      );
      await dispatchNotification(notification);
      break;
    }
    case "WalletCredited": {
      const notification = buildNotification(
        event.payload.userId,
        "PUSH",
        "Wallet credited",
        `Your wallet has been credited with ${event.payload.amount}.`
      );
      await dispatchNotification(notification);
      break;
    }
    default:
      break;
  }
}

export async function handleDomainEvent(
  topic: string,
  rawMessage: string
): Promise<void> {
  let event: AnyDomainEvent;
  try {
    event = JSON.parse(rawMessage) as AnyDomainEvent;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to parse event from topic %s: %s", topic, err);
    return;
  }

  if (topic === "user-events") {
    await handleUserEvent(event as UserEvent);
  } else if (topic === "ticket-events") {
    await handleTicketEvent(event as TicketEvent);
  } else if (topic === "payment-events") {
    await handlePaymentEvent(event as PaymentEvent);
  } else if (topic === "wallet-events") {
    await handleWalletEvent(event as WalletEvent);
  } else {
    // eslint-disable-next-line no-console
    console.warn("Received event for unhandled topic %s", topic);
  }
}


