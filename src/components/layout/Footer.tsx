
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

import logo from '@/assets/images/icon_logo_df_w.svg';

export const Footer = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between">
          <div className={`logo ${isMobile ? 'mb-2' : ''}`}>
            <Link to="/">
              <img 
                src={logo} 
                alt="DHFLOUR" 
                className={isMobile ? "h-10" : "h-8"}
              />
            </Link>
          </div>
          <div className="ft-left">
            <div className="info text-center sm:text-left">
              <p className={`whitespace-nowrap text-white ${isMobile ? 'text-sm' : 'text-m'}`}>
                문의전화번호 :
                <Link to={`tel:02-3455-0000`} className="text-white"> 02-3455-0000</Link>
              </p>
            </div>
          </div>
        </div>
        <div className="ft-bottom mt-2">
          <p className="text-sm">Copyright ⓒ 2025 대한제분(주) All right reserved.</p>
        </div>
      </div>
    </footer>
  );
};
