import apiClient from "./apiClient";
import type { GalleryFolder } from "@/types";

export const galleryService = {
  getFolders: async (userId: string): Promise<GalleryFolder[]> => {
    const res = await apiClient.get<GalleryFolder[]>(
      `/users/${userId}/gallery`,
    );
    return res.data;
  },

  getFolderById: async (folderId: string): Promise<GalleryFolder> => {
    const res = await apiClient.get<GalleryFolder>(`/gallery/${folderId}`);
    return res.data;
  },

  createFolder: async (
    name: string,
    userId: string,
  ): Promise<GalleryFolder> => {
    const res = await apiClient.post<GalleryFolder>("/gallery", { name });
    return res.data;
  },

  updateFolder: async (
    folderId: string,
    name: string,
  ): Promise<GalleryFolder> => {
    const res = await apiClient.patch<GalleryFolder>(`/gallery/${folderId}`, {
      name,
    });
    return res.data;
  },

  deleteFolder: async (folderId: string): Promise<void> => {
    await apiClient.delete(`/gallery/${folderId}`);
  },

  addArtwork: async (
    folderId: string,
    artworkId: string,
  ): Promise<GalleryFolder> => {
    const res = await apiClient.post<GalleryFolder>(
      `/gallery/${folderId}/artworks`,
      { artworkId },
    );
    return res.data;
  },

  removeArtwork: async (
    folderId: string,
    artworkId: string,
  ): Promise<GalleryFolder> => {
    const res = await apiClient.delete<GalleryFolder>(
      `/gallery/${folderId}/artworks/${artworkId}`,
    );
    return res.data;
  },
};
