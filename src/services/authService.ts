import apiClient from "./apiClient";
import type { LoginRequest, RegisterRequest, AuthResponse, RegisterApiResponse } from "@/types/api";
import type { User } from "@/types";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>("/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<{ email: string }> => {
    const res = await apiClient.post<RegisterApiResponse>("/auth/register", data);
    return { email: res.data.data.user.email };
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<User>("/auth/me");
    return res.data;
  },

  resendVerificationEmail: async (email: string): Promise<void> => {
    await apiClient.post("/auth/resend-verification", { email });
  },

  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.get(`/auth/verify-email?token=${token}`);
  },
};
