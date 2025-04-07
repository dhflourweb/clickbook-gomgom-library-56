
import { Link, useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from '@/context/AuthContext';

const categories = [
  "문학",
  "경제/경영",
  "자기개발",
  "인문/역사",
  "사회",
  "취미/생활",
  "기타"
];

export const Sidebar = () => {
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const isAdmin = hasRole(["admin", "system_admin"]);
  
  const navigateWithFilter = (path: string, filter?: string) => {
    if (filter) {
      navigate(`${path}?filter=${filter}`);
    } else {
      navigate(path);
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-white py-6 border-r">
      <div className="px-6 mb-6">
        <h2 className="text-lg font-medium text-primary-deepblue">메뉴</h2>
      </div>
      
      <div className="flex-1 px-3 overflow-auto">
        <div className="space-y-1">
          <Accordion type="single" collapsible className="border-none">
            <AccordionItem value="books" className="border-none">
              <AccordionTrigger className="py-2 px-3 rounded-md hover:bg-gray-100 text-sm font-medium">
                <div className="flex items-center">
                  <span>도서 관리</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-8 space-y-1 mt-1">
                  <div className="py-2 px-3 rounded-md hover:bg-gray-100 text-sm font-medium cursor-pointer"
                       onClick={() => navigateWithFilter('/books')}>
                    전체도서목록
                  </div>
                  <div className="py-2 px-3 rounded-md hover:bg-gray-100 text-sm font-medium cursor-pointer"
                       onClick={() => navigateWithFilter('/books', 'new')}>
                    신규도서
                  </div>
                  <div className="py-2 px-3 rounded-md hover:bg-gray-100 text-sm font-medium cursor-pointer"
                       onClick={() => navigateWithFilter('/books', 'recommended')}>
                    추천도서
                  </div>
                  <div className="py-2 px-3 rounded-md hover:bg-gray-100 text-sm font-medium cursor-pointer"
                       onClick={() => navigateWithFilter('/books', 'best')}>
                    베스트도서(국내)
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="categories" className="border-none">
              <AccordionTrigger className="py-2 px-3 rounded-md hover:bg-gray-100 text-sm font-medium">
                <div className="flex items-center">
                  <span>카테고리</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-8 space-y-1 mt-1">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="py-2 px-3 rounded-md hover:bg-gray-100 text-sm font-medium cursor-pointer"
                      onClick={() => navigateWithFilter('/books', `category=${category}`)}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="community" className="border-none">
              <AccordionTrigger className="py-2 px-3 rounded-md hover:bg-gray-100 text-sm font-medium">
                <div className="flex items-center">
                  <span>커뮤니티</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-8 space-y-1 mt-1">
                  <div className="py-2 px-3 rounded-md hover:bg-gray-100 text-sm font-medium cursor-pointer"
                       onClick={() => navigateWithFilter('/announcements')}>
                    공지사항
                  </div>
                  <div className="py-2 px-3 rounded-md hover:bg-gray-100 text-sm font-medium cursor-pointer"
                       onClick={() => navigateWithFilter('/inquiries')}>
                    문의하기
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="mypage" className="border-none">
              <AccordionTrigger className="py-2 px-3 rounded-md hover:bg-gray-100 text-sm font-medium">
                <div className="flex items-center">
                  <span>마이 페이지</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-8 space-y-1 mt-1">
                  <div className="py-2 px-3 rounded-md hover:bg-gray-100 text-sm font-medium cursor-pointer"
                       onClick={() => navigateWithFilter('/mypage')}>
                    내 정보
                  </div>
                  <div className="py-2 px-3 rounded-md hover:bg-gray-100 text-sm font-medium cursor-pointer"
                       onClick={() => navigateWithFilter('/mypage/history')}>
                    도서대여내역
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        {isAdmin && (
          <div className="mt-8">
            <h3 className="px-3 text-sm font-semibold text-gray-500 mb-2">
              관리자 메뉴
            </h3>
            <div className="space-y-1">
              <SidebarLink 
                to="/admin" 
                label="관리자 대시보드" 
              />
              <SidebarLink 
                to="/admin/books" 
                label="도서 관리" 
              />
              <SidebarLink 
                to="/admin/users" 
                label="사용자 관리" 
              />
              {hasRole("system_admin") && (
                <SidebarLink 
                  to="/admin/system" 
                  label="시스템 관리" 
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

const SidebarLink = ({ to, label, icon }: SidebarLinkProps) => {
  return (
    <Link to={to}>
      <div className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 text-sm font-medium">
        {icon && <span className="mr-2">{icon}</span>}
        <span>{label}</span>
      </div>
    </Link>
  );
};
