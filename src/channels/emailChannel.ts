import { Notification } from "../models/Notification";

export async function sendEmail(notification: Notification): Promise<void> {
  // In a real implementation, integrate with an SMTP server or provider like SendGrid.
  // For now we simply log to stdout.
  // eslint-disable-next-line no-console
  console.log("[EMAIL] To user %s | %s - %s", notification.userId, notification.subject, notification.content);
}


