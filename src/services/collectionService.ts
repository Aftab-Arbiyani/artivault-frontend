import apiClient from "./apiClient";
import type { Collection } from "@/types";

export const collectionService = {
  getAll: async (userId?: string): Promise<Collection[]> => {
    const res = await apiClient.get<Collection[]>(
      userId ? `/collections/${userId}` : "/collections",
    );
    return res.data;
  },

  create: async (name: string, description: string): Promise<Collection> => {
    const res = await apiClient.post<Collection>("/collections", {
      name,
      description,
    });
    return res.data;
  },

  addArtwork: async (
    collectionId: string,
    artworkId: string,
  ): Promise<Collection> => {
    const res = await apiClient.post<Collection>(
      `/collections/${collectionId}/add-artwork`,
      { artworkId },
    );
    return res.data;
  },

  removeArtwork: async (
    collectionId: string,
    artworkId: string,
  ): Promise<Collection> => {
    const res = await apiClient.delete<Collection>(
      `/collections/${collectionId}/remove-artwork`,
      {
        data: { artworkId },
      },
    );
    return res.data;
  },
};
