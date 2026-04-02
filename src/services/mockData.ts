import { User, Artwork, Comment, Notification, Collection, GalleryFolder } from '@/types';

const avatars = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
];

const artImages = [
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&h=700&fit=crop',
  'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=600&h=500&fit=crop',
  'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=600&h=500&fit=crop',
  'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&h=700&fit=crop',
  'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&h=800&fit=crop',
];

export const mockUsers: User[] = [
  { id: '1', username: 'aurora_arts', email: 'aurora@art.com', avatar: avatars[0], bio: 'Digital artist exploring surreal landscapes and dreamscapes.', followersCount: 12400, followingCount: 340, isFollowing: false },
  { id: '2', username: 'neon_brush', email: 'neon@art.com', avatar: avatars[1], bio: 'Illustrator & concept artist. Sci-fi enthusiast.', followersCount: 8900, followingCount: 210, isFollowing: true },
  { id: '3', username: 'pixel_dreamer', email: 'pixel@art.com', avatar: avatars[2], bio: 'Pixel art & retro game aesthetics.', followersCount: 5600, followingCount: 180, isFollowing: false },
  { id: '4', username: 'canvas_soul', email: 'canvas@art.com', avatar: avatars[3], bio: 'Traditional meets digital. Oil painting lover.', followersCount: 3200, followingCount: 95, isFollowing: false },
];

const titles = [
  'Ethereal Dawn', 'Cosmic Voyage', 'Urban Decay', 'Neon Dreams',
  'Silent Forest', 'Digital Bloom', 'Forgotten Temple', 'Ocean\'s Whisper',
  'Midnight Reverie', 'Chromatic Pulse', 'Verdant Echoes', 'Shattered Light',
];

const tagSets = [
  ['digital', 'surreal', 'landscape'], ['scifi', 'space', 'concept'],
  ['abstract', 'colorful', 'modern'], ['nature', 'photography', 'mood'],
  ['fantasy', 'character', 'illustration'], ['pixel', 'retro', 'gaming'],
];

export const mockArtworks: Artwork[] = Array.from({ length: 24 }, (_, i) => ({
  id: String(i + 1),
  title: titles[i % titles.length],
  description: 'A mesmerizing piece exploring the boundaries between reality and imagination. Created with passion and attention to every detail.',
  imageUrl: artImages[i % artImages.length],
  tags: tagSets[i % tagSets.length],
  artist: mockUsers[i % mockUsers.length],
  likesCount: Math.floor(Math.random() * 2000) + 100,
  commentsCount: Math.floor(Math.random() * 50) + 5,
  isLiked: Math.random() > 0.6,
  createdAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
}));

export const mockComments: Comment[] = [
  { id: '1', text: 'Absolutely stunning work! The colors are breathtaking.', author: mockUsers[1], createdAt: new Date(Date.now() - 3600000).toISOString(), replies: [
    { id: '1-1', text: 'Thank you so much! 💚', author: mockUsers[0], createdAt: new Date(Date.now() - 1800000).toISOString() },
  ]},
  { id: '2', text: 'The composition is incredible. How long did this take?', author: mockUsers[2], createdAt: new Date(Date.now() - 7200000).toISOString(), replies: [] },
  { id: '3', text: 'This gives me major sci-fi vibes. Love it!', author: mockUsers[3], createdAt: new Date(Date.now() - 14400000).toISOString(), replies: [] },
];

export const mockNotifications: Notification[] = [
  { id: '1', type: 'like', message: 'liked your artwork "Ethereal Dawn"', fromUser: mockUsers[1], isRead: false, createdAt: new Date(Date.now() - 600000).toISOString() },
  { id: '2', type: 'comment', message: 'commented on "Cosmic Voyage"', fromUser: mockUsers[2], isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', type: 'follow', message: 'started following you', fromUser: mockUsers[3], isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', type: 'like', message: 'liked your artwork "Neon Dreams"', fromUser: mockUsers[0], isRead: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: '5', type: 'like', message: 'liked your artwork "Ethereal Dawn"', fromUser: mockUsers[2], artwork: mockArtworks[0], isRead: false, createdAt: new Date(Date.now() - 900000).toISOString() },
  { id: '6', type: 'like', message: 'liked your artwork "Ethereal Dawn"', fromUser: mockUsers[3], artwork: mockArtworks[0], isRead: false, createdAt: new Date(Date.now() - 1200000).toISOString() },
  { id: '7', type: 'comment', message: 'commented on "Neon Dreams"', fromUser: mockUsers[1], artwork: mockArtworks[3], isRead: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
];

export const mockCollections: Collection[] = [
  { id: '1', name: 'Inspiration Board', description: 'My favorite pieces for reference', coverImage: artImages[0], artworkCount: 12, artworks: mockArtworks.slice(0, 4), createdAt: new Date().toISOString() },
  { id: '2', name: 'Sci-Fi Wonders', description: 'Best sci-fi art I\'ve found', coverImage: artImages[3], artworkCount: 8, artworks: mockArtworks.slice(4, 8), createdAt: new Date().toISOString() },
  { id: '3', name: 'Nature Studies', description: 'Beautiful nature-inspired works', coverImage: artImages[7], artworkCount: 15, artworks: mockArtworks.slice(8, 12), createdAt: new Date().toISOString() },
];

export const mockGalleryFolders: GalleryFolder[] = [
  { id: 'gf-1', name: 'Best of 2024', userId: '1', artworkCount: 5, artworks: mockArtworks.slice(0, 5), createdAt: new Date().toISOString() },
  { id: 'gf-2', name: 'Commissions', userId: '1', artworkCount: 3, artworks: mockArtworks.slice(5, 8), createdAt: new Date().toISOString() },
  { id: 'gf-3', name: 'Sketches & WIPs', userId: '1', artworkCount: 4, artworks: mockArtworks.slice(8, 12), createdAt: new Date().toISOString() },
  { id: 'gf-4', name: 'Fan Art', userId: '2', artworkCount: 2, artworks: mockArtworks.slice(2, 4), createdAt: new Date().toISOString() },
];
