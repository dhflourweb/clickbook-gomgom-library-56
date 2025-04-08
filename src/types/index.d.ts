
// Add this to your existing types.d.ts file

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishDate: string;
  isbn: string;
  coverImage: string;
  category: string;
  location?: string;
  source: string;
  badges: string[];
  status: {
    available: number;
    total: number;
    borrowed: number;
    reserved?: boolean;
  };
  rating?: number;
  registeredDate: string;
  description: string;
  isFavorite?: boolean;
  recommendations?: number;
  borrowedByCurrentUser?: boolean;
  borrowDate?: string;
  returnDueDate?: string;
  isExtendable?: boolean;
  hasBeenExtended?: boolean;
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  borrowedCount: number;
  borrowedBooks?: number;  // Book IDs the user has borrowed
}
