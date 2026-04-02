import apiClient from "./apiClient";
import type { User } from "@/types";
import type { FollowResponse } from "@/types/api";

export const userService = {
  getById: async (id: string): Promise<User> => {
    const res = await apiClient.get<User>(`/users/${id}`);
    return res.data;
  },

  search: async (query: string): Promise<User[]> => {
    const res = await apiClient.get<User[]>("/users/search", {
      params: { q: query },
    });
    return res.data;
  },
};

export const followService = {
  follow: async (userId: string): Promise<FollowResponse> => {
    const res = await apiClient.post<FollowResponse>(`/follow/${userId}`);
    return res.data;
  },

  unfollow: async (userId: string): Promise<FollowResponse> => {
    const res = await apiClient.delete<FollowResponse>(`/follow/${userId}`);
    return res.data;
  },
};
