import apiClient from "./apiClient";
import type { Artwork, PaginatedResponse } from "@/types";
import type { LikeResponse, UploadProgressCallback } from "@/types/api";

function mockPaginate(
  items: Artwork[],
  cursor?: string,
  limit = 12,
): PaginatedResponse<Artwork> {
  const startIndex = cursor ? parseInt(cursor, 10) : 0;
  const slice = items.slice(startIndex, startIndex + limit);
  const nextIndex = startIndex + limit;
  return {
    data: slice.map((a, i) => ({ ...a, id: `${startIndex + i}` })),
    nextCursor: nextIndex < items.length * 3 ? String(nextIndex) : null, // simulate 3x data
  };
}

export const artworkService = {
  getFeed: async (
    type: "explore" | "following" = "explore",
    cursor?: string,
    limit = 12,
  ): Promise<PaginatedResponse<Artwork>> => {
    const res = await apiClient.get<PaginatedResponse<Artwork>>("/feed", {
      params: { type, cursor, limit },
    });
    return res.data;
  },

  getById: async (id: string): Promise<Artwork> => {
    const res = await apiClient.get<Artwork>(`/artworks/${id}`);
    return res.data;
  },

  getByUser: async (
    userId: string,
    cursor?: string,
    limit = 12,
  ): Promise<PaginatedResponse<Artwork>> => {
    const res = await apiClient.get<PaginatedResponse<Artwork>>(
      `/users/${userId}/artworks`,
      {
        params: { cursor, limit },
      },
    );
    return res.data;
  },

  getByTag: async (
    tag: string,
    cursor?: string,
    limit = 12,
  ): Promise<PaginatedResponse<Artwork>> => {
    const res = await apiClient.get<PaginatedResponse<Artwork>>(
      `/tags/${tag}/artworks`,
      {
        params: { cursor, limit },
      },
    );
    return res.data;
  },

  search: async (
    query: string,
    cursor?: string,
    limit = 12,
  ): Promise<PaginatedResponse<Artwork>> => {
    const res = await apiClient.get<PaginatedResponse<Artwork>>(
      "/artworks/search",
      {
        params: { q: query, cursor, limit },
      },
    );
    return res.data;
  },

  upload: async (
    formData: FormData,
    onProgress?: UploadProgressCallback,
  ): Promise<Artwork> => {
    const res = await apiClient.post<Artwork>("/artworks", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });
    return res.data;
  },
};

export const likeService = {
  toggle: async (artworkId: string): Promise<LikeResponse> => {
    const res = await apiClient.post<LikeResponse>(
      `/artworks/${artworkId}/like`,
    );
    return res.data;
  },
};
