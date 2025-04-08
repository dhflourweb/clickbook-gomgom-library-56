
export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishDate: string;
  category: string;
  description?: string;
  coverImage: string;
  status: {
    total: number;
    available: number;
  };
  badges: BookBadge[];
  rating?: number;
  isFavorite?: boolean;
  // Adding missing properties
  isbn: string;
  location: string;
  source: string;
}

export type BookBadge = 'new' | 'recommended' | 'popular' | 'best' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  department: string;
  role: UserRole;
  borrowedBooks: number;
  reservedBooks: number;
  status: 'active' | 'inactive';
}

export type UserRole = 'user' | 'admin' | 'system_admin';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isPopup: boolean;
  createdAt: string;
  createdBy: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface ReadingGoal {
  userId: string;
  year: number;
  target: number;
  current: number;
}
