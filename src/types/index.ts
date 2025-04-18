
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
    borrowed?: number;
    reserved?: boolean;
  };
  badges: BookBadge[];
  rating?: number;
  isFavorite?: boolean;
  isbn: string;
  location: string;
  source: string;
  registeredDate: string;
  recommendations?: number;
  borrowedByCurrentUser?: boolean;
  borrowDate?: string;
  returnDueDate?: string;
  isExtendable?: boolean;
  hasBeenExtended?: boolean;
  isReservable?: boolean;
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
  borrowedCount?: number;
  employeeId: string; // Added this property
}

export type UserRole = 'EMP' | 'ADM';

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
