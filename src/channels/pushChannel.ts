import { Notification } from "../models/Notification";

export async function sendPush(notification: Notification): Promise<void> {
  // Placeholder for push notification provider (e.g., FCM, APNs).
  // eslint-disable-next-line no-console
  console.log("[PUSH] To user %s | %s - %s", notification.userId, notification.subject, notification.content);
}


