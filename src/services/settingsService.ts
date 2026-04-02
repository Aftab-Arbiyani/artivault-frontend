import apiClient from "./apiClient";
import type { UserSettings } from "@/types";

const SETTINGS_KEY = "user_settings";

export const settingsService = {
  get: async (): Promise<UserSettings> => {
    const res = await apiClient.get<UserSettings>("/users/settings");
    return res.data;
  },

  update: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    const res = await apiClient.patch<UserSettings>(
      "/users/settings",
      settings,
    );
    return res.data;
  },
};
