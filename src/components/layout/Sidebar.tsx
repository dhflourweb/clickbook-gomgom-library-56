
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Users, Settings, MessageSquare, Home, 
  BookMarked, BarChart3, Award, ChevronDown, ChevronRight, Layers, User
} from 'lucide-react';
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
    <div className="h-full flex flex-col bg-sidebar py-6">
      <div className="px-6 mb-6">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="text-secondary-orange">곰클릭</span>
          <span>+</span>
          <span className="text-primary-skyblue">책방</span>
        </Link>
      </div>
      
      <div className="flex-1 px-3 overflow-auto">
        <div className="space-y-1">
          <SidebarLink to="/" icon={<Home size={20} />} label="메인 화면" />
          
          <Accordion type="single" collapsible className="border-none">
            <AccordionItem value="books" className="border-none">
              <AccordionTrigger className="py-2 px-3 rounded-md hover:bg-sidebar-accent text-sm font-medium">
                <div className="flex items-center">
                  <BookOpen size={20} className="mr-2" />
                  <span>도서관리</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-8 space-y-1 mt-1">
                  <div className="py-2 px-3 rounded-md hover:bg-sidebar-accent text-sm font-medium cursor-pointer"
                       onClick={() => navigateWithFilter('/books')}>
                    도서목록
                  </div>
                  <div className="py-2 px-3 rounded-md hover:bg-sidebar-accent text-sm font-medium cursor-pointer"
                       onClick={() => navigateWithFilter('/books/details')}>
                    도서대여현황
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="categories" className="border-none">
              <AccordionTrigger className="py-2 px-3 rounded-md hover:bg-sidebar-accent text-sm font-medium">
                <div className="flex items-center">
                  <Layers size={20} className="mr-2" />
                  <span>카테고리</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-8 space-y-1 mt-1">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="py-2 px-3 rounded-md hover:bg-sidebar-accent text-sm font-medium cursor-pointer"
                      onClick={() => navigateWithFilter('/books', `category=${category}`)}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="community" className="border-none">
              <AccordionTrigger className="py-2 px-3 rounded-md hover:bg-sidebar-accent text-sm font-medium">
                <div className="flex items-center">
                  <MessageSquare size={20} className="mr-2" />
                  <span>커뮤니티</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-8 space-y-1 mt-1">
                  <div className="py-2 px-3 rounded-md hover:bg-sidebar-accent text-sm font-medium cursor-pointer"
                       onClick={() => navigateWithFilter('/announcements')}>
                    공지사항
                  </div>
                  <div className="py-2 px-3 rounded-md hover:bg-sidebar-accent text-sm font-medium cursor-pointer"
                       onClick={() => navigateWithFilter('/inquiries')}>
                    문의하기
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="mypage" className="border-none">
              <AccordionTrigger className="py-2 px-3 rounded-md hover:bg-sidebar-accent text-sm font-medium">
                <div className="flex items-center">
                  <User size={20} className="mr-2" />
                  <span>마이 페이지</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-8 space-y-1 mt-1">
                  <div className="py-2 px-3 rounded-md hover:bg-sidebar-accent text-sm font-medium cursor-pointer"
                       onClick={() => navigateWithFilter('/mypage')}>
                    내 정보
                  </div>
                  <div className="py-2 px-3 rounded-md hover:bg-sidebar-accent text-sm font-medium cursor-pointer"
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
            <h3 className="px-3 text-sm font-semibold text-sidebar-foreground/60 mb-2">
              관리자 메뉴
            </h3>
            <div className="space-y-1">
              <SidebarLink 
                to="/admin" 
                icon={<BarChart3 size={20} />} 
                label="관리자 대시보드" 
              />
              <SidebarLink 
                to="/admin/books" 
                icon={<BookMarked size={20} />} 
                label="도서 관리" 
              />
              <SidebarLink 
                to="/admin/users" 
                icon={<Users size={20} />} 
                label="사용자 관리" 
              />
              {hasRole("system_admin") && (
                <SidebarLink 
                  to="/admin/system" 
                  icon={<Settings size={20} />} 
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
      <div className="flex items-center py-2 px-3 rounded-md hover:bg-sidebar-accent text-sm font-medium">
        {icon && <span className="mr-2">{icon}</span>}
        <span>{label}</span>
      </div>
    </Link>
  );
};
