
export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  isPopup: boolean;
  popupEndDate?: string;
  imageUrl?: string;
  views: number;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface Inquiry {
  id: string;
  title: string;
  content: string;
  category: string;
  isPublic: boolean;
  status: 'pending' | 'answered';
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
  answer?: InquiryAnswer;
}

export interface InquiryAnswer {
  id: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}
