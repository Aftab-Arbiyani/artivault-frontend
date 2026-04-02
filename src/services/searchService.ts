import apiClient from "./apiClient";
import { mockArtworks, mockUsers } from "./mockData";
import type { Artwork, User, PaginatedResponse } from "@/types";
import type { SearchResponse } from "@/types/api";

export const searchService = {
  searchAll: async (
    query: string,
    cursor?: string,
    limit = 12,
  ): Promise<SearchResponse> => {
    const res = await apiClient.get<SearchResponse>("/search", {
      params: { q: query, type: "all", cursor, limit },
    });
    return res.data;
  },

  searchArtworks: async (
    query: string,
    cursor?: string,
    limit = 12,
  ): Promise<PaginatedResponse<Artwork>> => {
    const res = await apiClient.get<PaginatedResponse<Artwork>>("/search", {
      params: { q: query, type: "artworks", cursor, limit },
    });
    return res.data;
  },

  searchUsers: async (
    query: string,
    cursor?: string,
    limit = 12,
  ): Promise<PaginatedResponse<User>> => {
    const res = await apiClient.get<PaginatedResponse<User>>("/search", {
      params: { q: query, type: "users", cursor, limit },
    });
    return res.data;
  },
};
