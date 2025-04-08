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
  badges: string[];
  rating?: number;
  isFavorite?: boolean;
}
