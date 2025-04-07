
export type UserRole = "user" | "admin" | "system_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: UserRole;
  borrowedBooks: number;
  reservedBooks: number;
  status: "active" | "inactive" | "dormant";
}

export interface BookStatus {
  available: number;
  total: number;
}

export type BookBadge = "new" | "recommended" | "popular" | "best" | null;

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  coverImage: string;
  category: string;
  location: string;
  source: "purchase" | "donation";
  badges: BookBadge[];
  status: BookStatus;
  description?: string;
  rating?: number;
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

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isPopup: boolean;
  createdAt: string;
  createdBy: string;
}

export interface Inquiry {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  type: string;
  isPrivate: boolean;
  status: "pending" | "answered";
  createdAt: string;
  answer?: {
    content: string;
    answeredBy: string;
    answeredAt: string;
  };
}
