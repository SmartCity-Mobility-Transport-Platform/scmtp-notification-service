export type NotificationChannel = "EMAIL" | "SMS" | "PUSH";

export interface Notification {
  id: string;
  userId: string | null;
  channel: NotificationChannel;
  subject: string;
  content: string;
  status: "PENDING" | "SENT" | "FAILED";
  createdAt: Date;
}

// In-memory store for demo / local development. In production this would be PostgreSQL.
const notifications: Notification[] = [];

export function addNotification(notification: Notification): void {
  notifications.unshift(notification);
}

export function listNotifications(limit = 50): Notification[] {
  return notifications.slice(0, limit);
}


