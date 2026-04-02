import apiClient from "./apiClient";
import type { Comment, PaginatedResponse } from "@/types";

export const commentService = {
  getByArtwork: async (
    artworkId: string,
    cursor?: string,
    limit = 20,
  ): Promise<PaginatedResponse<Comment>> => {
    const res = await apiClient.get<PaginatedResponse<Comment>>(
      `/artworks/${artworkId}/comments`,
      {
        params: { cursor, limit },
      },
    );
    return res.data;
  },

  create: async (
    artworkId: string,
    text: string,
    parentId?: string,
  ): Promise<Comment> => {
    const res = await apiClient.post<Comment>(
      `/artworks/${artworkId}/comments`,
      { text, parentId },
    );
    return res.data;
  },
};
