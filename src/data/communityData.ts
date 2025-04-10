
import { Announcement, Inquiry } from '@/types/community';

export const ANNOUNCEMENT_CATEGORIES = [
  '신간도서', 
  '일반공지', 
  '장애복구', 
  '이벤트'
];

export const INQUIRY_CATEGORIES = [
  '도서신청', 
  '일반', 
  '기부', 
  '시스템', 
  '훼손', 
  '기타'
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-001',
    title: '곰클릭+책방 서비스 오픈 안내',
    content: '안녕하세요, 곰클릭+책방 서비스가 정식 오픈되었습니다. 많은 이용 부탁드립니다.',
    category: '일반공지',
    isPinned: true,
    isPopup: true,
    popupEndDate: '2025-05-10',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
    views: 234,
    createdAt: '2025-04-01T10:00:00',
    createdBy: 'admin',
    updatedAt: '2025-04-01T11:30:00',
    updatedBy: 'admin'
  },
  {
    id: 'ann-002',
    title: '4월 신간도서 입고 안내',
    content: '4월 신간도서가 입고되었습니다. 인기 작가의 신간부터 화제의 베스트셀러까지 다양한 도서를 만나보세요.',
    category: '신간도서',
    isPinned: true,
    isPopup: false,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
    views: 187,
    createdAt: '2025-04-03T09:15:00',
    createdBy: 'admin',
  },
  {
    id: 'ann-003',
    title: '시스템 점검 안내 (4/15)',
    content: '안녕하세요. 4월 15일 오전 2시부터 4시까지 시스템 정기 점검이 진행될 예정입니다. 해당 시간에는 서비스 이용이 제한됩니다.',
    category: '장애복구',
    isPinned: false,
    isPopup: true,
    popupEndDate: '2025-04-15',
    views: 56,
    createdAt: '2025-04-08T14:30:00',
    createdBy: 'system',
  },
  {
    id: 'ann-004',
    title: '봄맞이 독서 이벤트 안내',
    content: '봄맞이 독서 이벤트를 진행합니다. 이벤트 기간 동안 대여하신 도서에 대한 리뷰를 작성하시면 추첨을 통해 소정의 상품을 드립니다.',
    category: '이벤트',
    isPinned: false,
    isPopup: false,
    imageUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646',
    views: 129,
    createdAt: '2025-04-05T11:20:00',
    createdBy: 'admin',
  },
  {
    id: 'ann-005',
    title: '도서관 이용 규칙 안내',
    content: '도서관 이용 규칙을 안내드립니다. 모든 회원님들의 원활한 도서관 이용을 위해 규칙을 준수해 주시기 바랍니다.',
    category: '일반공지',
    isPinned: false,
    isPopup: false,
    views: 89,
    createdAt: '2025-03-28T16:45:00',
    createdBy: 'admin',
  },
];

export const mockInquiries: Inquiry[] = [
  {
    id: 'inq-001',
    title: 'IT 관련 도서 추가 요청',
    content: '최근 출간된 인공지능 관련 도서를 추가해주실 수 있을까요? 특히 "모던 머신러닝의 이해" 라는 책을 구비해주시면 좋겠습니다.',
    category: '도서신청',
    isPublic: true,
    status: 'answered',
    createdAt: '2025-04-05T09:22:00',
    createdBy: 'user123',
    answer: {
      id: 'ans-001',
      content: '안녕하세요. 요청하신 도서는 다음 주 입고 예정입니다. 입고되면 알림 드리겠습니다.',
      isPublic: true,
      createdAt: '2025-04-06T11:32:00',
      createdBy: 'admin'
    }
  },
  {
    id: 'inq-002',
    title: '책 훼손 신고',
    content: '대여한 "디자인 씽킹" 도서의 35페이지가 찢어져 있습니다. 반납 시 문제가 될까요?',
    category: '훼손',
    isPublic: false,
    status: 'answered',
    createdAt: '2025-04-07T14:15:00',
    createdBy: 'user456',
    answer: {
      id: 'ans-002',
      content: '안녕하세요. 사전에 신고해주셔서 감사합니다. 해당 사항은 기록해두었으니 반납 시 별도 비용이 발생하지 않습니다. 다만 반납 시 직원에게 말씀해주세요.',
      isPublic: false,
      createdAt: '2025-04-07T16:05:00',
      createdBy: 'admin'
    }
  },
  {
    id: 'inq-003',
    title: '도서 연장 문의',
    content: '연장 버튼이 비활성화되어있는데, 한 번 더 연장할 수 있는 방법이 있을까요?',
    category: '일반',
    isPublic: true,
    status: 'answered',
    createdAt: '2025-04-08T10:30:00',
    createdBy: 'user789',
    answer: {
      id: 'ans-003',
      content: '안녕하세요. 도서 연장은 1회만 가능합니다. 추가 연장은 불가능하오니 반납일을 준수해 주시기 바랍니다.',
      isPublic: true,
      createdAt: '2025-04-08T13:25:00',
      createdBy: 'admin'
    }
  },
  {
    id: 'inq-004',
    title: '기부 도서 관련 문의',
    content: '개인 소장 도서를 기부하고 싶은데 어떤 절차를 거쳐야 하나요?',
    category: '기부',
    isPublic: true,
    status: 'pending',
    createdAt: '2025-04-10T09:17:00',
    createdBy: 'user234'
  },
  {
    id: 'inq-005',
    title: '로그인 오류 문의',
    content: '오늘부터 로그인이 안 되는 상황이 발생하고 있습니다. 어떻게 해결할 수 있을까요?',
    category: '시스템',
    isPublic: true,
    status: 'pending',
    createdAt: '2025-04-10T11:44:00',
    createdBy: 'user567'
  }
];

// Helper functions
export function getAnnouncements() {
  return [...mockAnnouncements].sort((a, b) => {
    // First sort by pinned status
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then sort by date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function getAnnouncementById(id: string) {
  return mockAnnouncements.find(announcement => announcement.id === id);
}

export function getInquiries(userId?: string) {
  if (!userId) return [];
  
  // If userId is provided, return only inquiries by that user or public inquiries
  return [...mockInquiries]
    .filter(inquiry => inquiry.createdBy === userId || (inquiry.isPublic && inquiry.status === 'answered'))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getInquiriesByAdmin() {
  return [...mockInquiries].sort((a, b) => {
    // Pending inquiries first
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    
    // Then sort by date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function getInquiryById(id: string, userId?: string) {
  const inquiry = mockInquiries.find(inquiry => inquiry.id === id);
  if (!inquiry) return null;
  
  // Only return if the inquiry is by the user, public, or if the user is admin
  if (inquiry.createdBy === userId || (inquiry.isPublic && inquiry.status === 'answered') || userId === 'admin') {
    return inquiry;
  }
  
  return null;
}
