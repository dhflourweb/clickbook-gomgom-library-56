import { Book, Announcement, Review, ReadingGoal } from '@/types';

export const MOCK_BOOKS: Book[] = [
  {
    id: 'book1',
    title: '클린 코드: 애자일 소프트웨어 장인 정신',
    author: '로버트 C. 마틴',
    publisher: '인사이트',
    publishDate: '2013-12-24',
    isbn: '9788966260959',
    coverImage: 'https://picsum.photos/seed/book1/300/400',
    category: '기타',
    location: '본관 3층 개발서적',
    source: 'purchase',
    badges: ['recommended'],
    status: { available: 2, total: 3, borrowed: 1 },
    rating: 4.8,
    registeredDate: '2023-05-15',
    description: '프로그래머라면 꼭 읽어야 할 클린 코드에 대한 책입니다. 더 나은 코드를 작성하는 방법과 프로그래밍 원칙을 설명합니다.',
    isFavorite: true,
    borrowedByCurrentUser: true,
    borrowDate: '2024-04-01',
    returnDueDate: '2024-04-15',
    isExtendable: true,
    hasBeenExtended: false
  },
  {
    id: 'book2',
    title: '함께 자라기: 애자일로 가는 길',
    author: '김창준',
    publisher: '인사이트',
    publishDate: '2019-03-20',
    isbn: '9788966262335',
    coverImage: 'https://picsum.photos/seed/book2/300/400',
    category: '자기개발',
    location: '본관 3층 개발서적',
    source: 'purchase',
    badges: ['best'],
    status: { available: 0, total: 2, borrowed: 2 },
    rating: 4.9,
    registeredDate: '2023-06-10',
    description: '애자일 방법론과 팀 문화에 대한 국내 저자의 인사이트가 담긴 책입니다.',
    borrowedByCurrentUser: true,
    borrowDate: '2024-03-20',
    returnDueDate: '2024-04-03',
    isExtendable: false,
    hasBeenExtended: true
  },
  {
    id: 'book3',
    title: '리팩터링: 코드 품질을 개선하는 기술',
    author: '마틴 파울러',
    publisher: '한빛미디어',
    publishDate: '2020-06-15',
    isbn: '9791162242742',
    coverImage: 'https://picsum.photos/seed/book3/300/400',
    category: '기타',
    location: '본관 3층 개발서적',
    source: 'purchase',
    badges: [],
    status: { available: 0, total: 1, borrowed: 1 },
    rating: 4.7,
    registeredDate: '2023-07-22',
    description: '코드 리팩터링에 대한 기술과 원칙을 설명하는 개발자를 위한 필독서입니다.',
    isReservable: false
  },
  {
    id: 'book4',
    title: '1만 시간의 재발견',
    author: '안데르스 에릭슨, 로버트 풀',
    publisher: '비즈니스북스',
    publishDate: '2019-08-10',
    isbn: '8963352138',
    coverImage: 'https://picsum.photos/seed/book4/300/400',
    category: '자기개발',
    location: '별관 2층 자기계발',
    source: 'donation',
    badges: ['new'],
    status: { available: 0, total: 3, borrowed: 3 },
    rating: 4.2,
    registeredDate: '2024-01-05',
    description: '진정한 전문성을 기르는 효과적인 학습법에 대한 책입니다.',
    borrowedByCurrentUser: true,
    borrowDate: '2024-03-15',
    returnDueDate: '2024-04-10',
    isExtendable: false,
    hasBeenExtended: true
  },
  {
    id: 'book5',
    title: '사피엔스: 유인원에서 사이보그까지',
    author: '유발 하라리',
    publisher: '김영사',
    publishDate: '2015-11-24',
    isbn: '9788934972464',
    coverImage: 'https://picsum.photos/seed/book5/300/400',
    category: '인문/역사',
    location: '본관 2층 인문학',
    source: 'purchase',
    badges: ['best'],
    status: { available: 0, total: 5, borrowed: 5 },
    rating: 4.8,
    registeredDate: '2023-03-17',
    description: '인간의 역사와 미래에 대한 통찰을 담은 세계적인 베스트셀러입니다.',
    isFavorite: true,
    isReservable: false
  },
  {
    id: 'book6',
    title: '그릿: 열정, 끈기, 인내의 힘',
    author: '앤절라 더크워스',
    publisher: '비즈니스북스',
    publishDate: '2017-02-15',
    isbn: '9788965705918',
    coverImage: 'https://picsum.photos/seed/book6/300/400',
    category: '자기개발',
    location: '별관 2층 자기계발',
    source: 'purchase',
    badges: ['recommended'],
    status: { available: 1, total: 2, borrowed: 1 },
    rating: 4.5,
    registeredDate: '2023-09-05',
    description: '성공의 핵심 요소인 그릿(끈기)에 대해 설명하는 책입니다.',
    isFavorite: true
  },
  {
    id: 'book7',
    title: '어떻게 일할 것인가',
    author: '고영성, 김앤드류',
    publisher: '스노우폭스북스',
    publishDate: '2020-05-12',
    isbn: '9791187512035',
    coverImage: 'https://picsum.photos/seed/book7/300/400',
    category: '경제/경영',
    location: '별관 1층 경영서적',
    source: 'purchase',
    badges: ['new', 'recommended'],
    status: { available: 2, total: 3, borrowed: 1 },
    rating: 4.3,
    registeredDate: '2024-02-20',
    description: '일에서 성과를 내는 방법과 성장하는 방법에 대한 실용적인 조언이 담긴 책입니다.'
  },
  {
    id: 'book8',
    title: '소프트웨어 아키텍처의 기초',
    author: '마크 리처즈, 닠 포드',
    publisher: '한빛미디어',
    publishDate: '2021-01-30',
    isbn: '9791162245484',
    coverImage: 'https://picsum.photos/seed/book8/300/400',
    category: '기타',
    location: '본관 3층 개발서적',
    source: 'purchase',
    badges: ['new'],
    status: { available: 1, total: 1, borrowed: 0 },
    rating: 4.6,
    registeredDate: '2024-03-15',
    description: '소프트웨어 아키텍처의 기본 개념과 패턴을 설명하는 책입니다.'
  },
  {
    id: 'book9',
    title: '데미안',
    author: '헤르만 헤세',
    publisher: '민음사',
    publishDate: '2009-01-20',
    isbn: '9788937460449',
    coverImage: 'https://picsum.photos/seed/book9/300/400',
    category: '문학',
    location: '본관 1층 문학',
    source: 'purchase',
    badges: [],
    status: { available: 3, total: 5, borrowed: 2 },
    rating: 4.7,
    registeredDate: '2022-11-10',
    description: '자아의 발견과 성장에 관한 헤르만 헤세의 대표작입니다.'
  },
  {
    id: 'book10',
    title: '노인과 바다',
    author: '어니스트 헤밍웨이',
    publisher: '민음사',
    publishDate: '2012-05-15',
    isbn: '9788937462078',
    coverImage: 'https://picsum.photos/seed/book10/300/400',
    category: '문학',
    location: '본관 1층 문학',
    source: 'purchase',
    badges: ['best'],
    status: { available: 1, total: 2, borrowed: 1 },
    rating: 4.5,
    registeredDate: '2023-02-28',
    description: '노인 어부와 거대한 물고기의 이야기를 담은 헤밍웨이의 걸작입니다.'
  },
  {
    id: 'book11',
    title: '경제학 콘서트',
    author: '팀 하포드',
    publisher: '웅진지식하우스',
    publishDate: '2010-08-20',
    isbn: '9788901097138',
    coverImage: 'https://picsum.photos/seed/book11/300/400',
    category: '경제/경영',
    location: '별관 1층 경영서적',
    source: 'purchase',
    badges: ['recommended'],
    status: { available: 2, total: 2, borrowed: 0 },
    rating: 4.3,
    registeredDate: '2023-04-15',
    description: '일상 속 경제 원리를 쉽게 풀어낸 경제학 입문서입니다.'
  },
  {
    id: 'book12',
    title: '정원 가꾸기의 즐거움',
    author: '카렌 하퍼',
    publisher: '그린북',
    publishDate: '2022-04-10',
    isbn: '9791163241508',
    coverImage: 'https://picsum.photos/seed/book12/300/400',
    category: '취미/생활',
    location: '별관 3층 취미',
    source: 'donation',
    badges: ['new'],
    status: { available: 1, total: 1, borrowed: 0 },
    rating: 4.2,
    registeredDate: '2024-04-01',
    description: '집에서 할 수 있는 다양한 정원 가꾸기 방법을 소개합니다.'
  },
  {
    id: 'book13',
    title: '현대 사회와 윤리',
    author: '마이클 샌델',
    publisher: '와이즈베리',
    publishDate: '2020-09-30',
    isbn: '978891163711223',
    coverImage: 'https://picsum.photos/seed/book13/300/400',
    category: '사회',
    location: '본관 2층 사회과학',
    source: 'purchase',
    badges: [],
    status: { available: 0, total: 3, borrowed: 3 },
    rating: 4.6,
    registeredDate: '2023-08-22',
    description: '현대 사의 다양한 윤리적 딜레마를 철학적 관점에서 분석합니다.'
  },
  {
    id: 'book14',
    title: '미니멀 라이프',
    author: '조슈아 베커',
    publisher: '이덴슬리벨',
    publishDate: '2019-11-15',
    isbn: '9791188862382',
    coverImage: 'https://picsum.photos/seed/book14/300/400',
    category: '취미/생활',
    location: '별관 3층 라이프스타일',
    source: 'purchase',
    badges: ['recommended'],
    status: { available: 2, total: 2, borrowed: 0 },
    rating: 4.1,
    registeredDate: '2023-10-15',
    description: '적게 소유하고 최대한 깊이 있게 삶을 사는 방법에 대해 안내합니다.'
  },
  {
    id: 'book15',
    title: '한국사의 재조명',
    author: '이이화',
    publisher: '역사비평사',
    publishDate: '2018-03-10',
    isbn: '9788976967725',
    coverImage: 'https://picsum.photos/seed/book15/300/400',
    category: '인문/역사',
    location: '본관 2층 역사',
    source: 'purchase',
    badges: [],
    status: { available: 1, total: 1, borrowed: 0 },
    rating: 4.4,
    registeredDate: '2023-05-30',
    description: '한국사의 주요 사건들을 새로운 시각에서 조명한 역사서입니다.'
  },
  {
    id: 'book16',
    title: '세계 문화의 이해',
    author: '김영철',
    publisher: '학지사',
    publishDate: '2021-09-20',
    isbn: '9788999867458',
    coverImage: 'https://picsum.photos/seed/book16/300/400',
    category: '인문/역사',
    location: '본관 2층 인문학',
    source: 'purchase',
    badges: ['new'],
    status: { available: 3, total: 3, borrowed: 0 },
    rating: 4.0,
    registeredDate: '2024-03-01',
    description: '세계 각국의 문화와 역사에 대한 개괄적인 소개를 담고 있습니다.'
  }
];

export const MOCK_BANNER_ITEMS = [
  {
    id: 'banner1',
    title: '5월 신규 도서 안내',
    description: '이번 달에 새로 들어온 IT/개발 관련 신간들을 확인해보세요!',
    image: 'https://picsum.photos/seed/banner1/1200/400',
    buttonText: '신규 도서 보기',
    buttonLink: '/books?filter=new',
  },
  {
    id: 'banner2',
    title: '독서 챌린지 시작!',
    description: '올해의 독서 목표를 설정하고 다양한 뱃지를 획득하세요.',
    image: 'https://picsum.photos/seed/banner2/1200/400',
    buttonText: '챌린지 참여하기',
    buttonLink: '/mypage/goals',
  },
  {
    id: 'banner3',
    title: 'IT 트렌드 2024',
    description: '2024년 주목해야 할 IT 기술 트렌드 관련 도서를 소개합니다.',
    image: 'https://picsum.photos/seed/banner3/1200/400',
    buttonText: '트렌드 둘러보기',
    buttonLink: '/books?category=IT/개발',
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: '도서관 이용시간 변경 안내',
    content: '5월부터 도서관 이용시간이 오전 9시부터 저녁 7시까지로 확장됩니다.',
    isPinned: true,
    isPopup: true,
    createdAt: '2024-04-25T10:00:00Z',
    createdBy: '시스템 관리자',
  },
  {
    id: 'a2',
    title: '신규 도서 입고 안내',
    content: '4월 3주차 신규 도서가 입고되었습니다. 홈페이지에서 확인하세요.',
    isPinned: false,
    isPopup: false,
    createdAt: '2024-04-18T14:30:00Z',
    createdBy: '도서 관리자',
  },
  {
    id: 'a3',
    title: '도서 기부 캠페인 안내',
    content: '사내 도서 기부 캠페인이 5월 한 달간 진행됩니다. 많은 참여 부탁드립니다.',
    isPinned: false,
    isPopup: false,
    createdAt: '2024-04-10T09:15:00Z',
    createdBy: '도서 관리자',
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    userId: 'u1',
    userName: '홍길동',
    bookId: 'book1',
    rating: 5,
    content: '정말 유익한 내용입니다. 코드 작성 능력이 향상된 것 같아요.',
    createdAt: '2024-03-15T14:30:00Z',
  },
  {
    id: 'r2',
    userId: 'u2',
    userName: '김철수',
    bookId: 'book1',
    rating: 4,
    content: '좋은 책이지만 번역이 조금 아쉬웠습니다.',
    createdAt: '2024-02-20T11:45:00Z',
  },
  {
    id: 'r3',
    userId: 'u3',
    userName: '이영희',
    bookId: 'book2',
    rating: 5,
    content: '애자일에 대한 좋은 인사이트를 얻었습니다. 강력 추천합니다!',
    createdAt: '2024-04-05T16:20:00Z',
  },
];

export const MOCK_READING_GOAL: ReadingGoal = {
  userId: 'u1',
  year: 2024,
  target: 24,
  current: 8,
};

export const SYSTEM_SETTINGS = {
  borrowDays: 14,  // Default borrowing period in days
  extensionDays: 7,  // Default extension period in days
  maxBorrowLimit: 2,  // Maximum books a user can borrow
  maxExtensionCount: 1  // Maximum number of extensions allowed per book
};

export const getRecommendedBooks = (): Book[] => {
  return MOCK_BOOKS.filter(book => book.badges.includes('recommended'));
};

export const getNewBooks = (): Book[] => {
  return MOCK_BOOKS.filter(book => book.badges.includes('new'));
};

export const getBestBooks = (): Book[] => {
  return MOCK_BOOKS.filter(book => book.badges.includes('best'));
};

export const getFavoriteBooks = (): Book[] => {
  return MOCK_BOOKS.filter(book => book.isFavorite);
};

export const getBooksByCategory = (category: string): Book[] => {
  if (category === '전체') return MOCK_BOOKS;
  return MOCK_BOOKS.filter(book => book.category === category);
};

export const getBookById = (id: string): Book | undefined => {
  return MOCK_BOOKS.find(book => book.id === id);
};

export const getReviewsForBook = (bookId: string): Review[] => {
  return MOCK_REVIEWS.filter(review => review.bookId === bookId);
};

export const hasReachedBorrowLimit = (userId: string): boolean => {
  const borrowedCount = MOCK_BOOKS.filter(book => book.borrowedByCurrentUser).length;
  return borrowedCount >= SYSTEM_SETTINGS.maxBorrowLimit;
};
