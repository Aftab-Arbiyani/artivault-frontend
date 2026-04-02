import apiClient from "./apiClient";
import type { Notification } from "@/types";

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const res = await apiClient.get<Notification[]>("/notifications");
    return res.data;
  },

  markRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  markAllRead: async (): Promise<void> => {
    await apiClient.patch("/notifications/read-all");
  },
};
