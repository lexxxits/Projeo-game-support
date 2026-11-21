export type ThemeMode = 'light' | 'dark';

export interface ImplementationItem {
  id: string;
  text: string;
  done: boolean;
}

export interface UpdatePanel {
  id: string;
  version: string;
  headerLabel: string;
  title: string;
  subtitle: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  date: string; // DD/MM/YYYY
  imageUrl: string; // Cover image (first image in images[])
  images: string[]; // Multiple carousel photos
  videoUrl?: string; // Optional uploaded or external video URL
  implementations: ImplementationItem[];
  mediaTypeLabel: string;
  supportCount: number;
  totalRaised: number;
  goalAmount: number;
  views: number;
  likes: number;
  likedByMe?: boolean;
  sponsors: string[];
  supportValues: number[];
  order: number;
}

export interface GameConfig {
  iframeUrl: string;
  useExternalIframe: boolean;
}

export interface SupportImpulse {
  id: string;
  updateId: string;
  updateTitle: string;
  amount: number;
  supporterName: string;
  message: string;
  createdAt: string;
}

export interface CommunityComment {
  id: string;
  author: string;
  role: 'Criador' | 'Apoiador';
  message: string;
  createdAt: string;
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'creator' | 'supporter';
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'creator' | 'supporter';
}
