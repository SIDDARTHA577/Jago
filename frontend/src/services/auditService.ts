import { mockStore } from '../lib/mockStore';
import { AuditLog, NotificationItem } from '../types';

export const auditService = {
  async getAuditLogs(): Promise<AuditLog[]> {
    return mockStore.getAuditLogs();
  }
};

export const notificationService = {
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    return mockStore.getNotifications(userId);
  },

  async markAsRead(notificationId: string): Promise<void> {
    mockStore.markNotificationRead(notificationId);
  },

  async markAllAsRead(userId: string): Promise<void> {
    mockStore.markAllNotificationsRead(userId);
  }
};
