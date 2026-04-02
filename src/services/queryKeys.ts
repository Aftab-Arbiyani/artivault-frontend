// Query key factory for consistent, structured keys
export const queryKeys = {
  // Feed
  feed: (type: string, tag?: string) => ['feed', type, tag] as const,

  // Users
  user: (id: string) => ['user', id] as const,
  userArtworks: (userId: string) => ['userArtworks', userId] as const,
  currentUser: () => ['currentUser'] as const,

  // Artworks
  artwork: (id: string) => ['artwork', id] as const,

  // Comments
  comments: (artworkId: string) => ['comments', artworkId] as const,

  // Notifications
  notifications: () => ['notifications'] as const,

  // Collections
  collections: (userId?: string) => ['collections', userId] as const,

  // Gallery
  galleryFolders: (userId: string) => ['galleryFolders', userId] as const,
  galleryFolder: (folderId: string) => ['galleryFolder', folderId] as const,

  // Search
  search: (query: string, type?: string) => ['search', query, type] as const,
  searchArtworks: (query: string) => ['searchArtworks', query] as const,
  searchUsers: (query: string) => ['searchUsers', query] as const,

  // Tags
  artworksByTag: (tag: string) => ['artworksByTag', tag] as const,
} as const;
