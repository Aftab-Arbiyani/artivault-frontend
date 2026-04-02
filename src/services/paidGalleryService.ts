import apiClient from "./apiClient";
import type { PaidGallery, PaginatedResponse } from "@/types";

export const paidGalleryService = {
  getByUser: async (userId: string): Promise<PaidGallery[]> => {
    const res = await apiClient.get<PaidGallery[]>(`/paid-galleries/${userId}`);
    return res.data;
  },

  create: async (data: {
    title: string;
    description: string;
    price: number;
  }): Promise<PaidGallery> => {
    const res = await apiClient.post<PaidGallery>("/paid-galleries", data);
    return res.data;
  },

  addArtwork: async (galleryId: string, artworkId: string): Promise<void> => {
    await apiClient.post(`/paid-galleries/${galleryId}/add-artwork`, {
      artworkId,
    });
  },

  purchase: async (galleryId: string): Promise<{ url: string }> => {
    const res = await apiClient.post<{ url: string }>(
      `/paid-galleries/${galleryId}/purchase`,
    );
    return res.data;
  },
};
