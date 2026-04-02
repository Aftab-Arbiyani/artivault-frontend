// =============================================
// API Request & Response Types
// =============================================

// --- Auth ---
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: import('@/types').User;
}

export interface RegisterApiResponse {
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      bio: string | null;
      avatar_url: string | null;
      cover_url: string | null;
      followers_count: number;
      following_count: number;
      show_mature_content: boolean;
      is_email_verified: boolean;
      created_at: string;
      updated_at: string;
    };
  };
  statusCode: number;
  timestamp: string;
}

// --- Feed ---
export interface FeedParams {
  cursor?: string;
  limit?: number;
  type: 'explore' | 'following';
  tag?: string;
}

// --- Artwork ---
export interface CreateArtworkRequest {
  title: string;
  description: string;
  tags: string[];
  image: File;
}

export interface LikeResponse {
  liked: boolean;
  count: number;
}

// --- Comment ---
export interface CreateCommentRequest {
  text: string;
  parentId?: string;
}

// --- Follow ---
export interface FollowResponse {
  following: boolean;
}

// --- Gallery ---
export interface CreateFolderRequest {
  name: string;
}

// --- Search ---
export interface SearchParams {
  query: string;
  type?: 'all' | 'artworks' | 'users';
  cursor?: string;
  limit?: number;
}

export interface SearchResponse {
  artworks: import('@/types').Artwork[];
  users: import('@/types').User[];
  nextCursor: string | null;
}

// --- Notification ---
export interface MarkReadRequest {
  ids: string[];
}

// --- Upload ---
export interface UploadProgressCallback {
  (progress: number): void;
}

// --- Collection ---
export interface AddArtworkToCollectionRequest {
  artworkId: string;
}
