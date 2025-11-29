import { Notification } from "../models/Notification";

export async function sendSms(notification: Notification): Promise<void> {
  // Placeholder for SMS gateway integration (e.g., Twilio).
  // eslint-disable-next-line no-console
  console.log("[SMS] To user %s | %s", notification.userId, notification.content);
}


