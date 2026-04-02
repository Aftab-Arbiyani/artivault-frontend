export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  isEmailVerified?: boolean;
}

export interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  artist: User;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isAiGenerated?: boolean;
  isMature?: boolean;
  publishAt?: string | null;
  createdAt: string;
}

export interface Subscription {
  id: string;
  plan: 'free' | 'pro' | 'premium';
  status: 'active' | 'inactive' | 'cancelled';
  currentPeriodEnd?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

export interface PaidGallery {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  artistId: string;
  artist: User;
  artworkCount: number;
  previewImages: string[];
  isPurchased: boolean;
  createdAt: string;
}

export interface UserSettings {
  showMatureContent: boolean;
}

export interface Comment {
  id: string;
  text: string;
  author: User;
  createdAt: string;
  replies?: Comment[];
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  message: string;
  fromUser: User;
  artwork?: Artwork;
  isRead: boolean;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  artworkCount: number;
  artworks: Artwork[];
  createdAt: string;
}

export interface GalleryFolder {
  id: string;
  name: string;
  userId: string;
  artworkCount: number;
  artworks: Artwork[];
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Cursor-based pagination
export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
}
