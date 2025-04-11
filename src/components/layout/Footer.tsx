
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

import logo from '@/assets/images/icon_logo_df_w.svg';

export const Footer = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
          <div className="flex flex-col items-start">
            <div className={`logo ${isMobile ? 'mb-2' : ''}`}>
              <Link to="/">
                <img
                  src={logo} 
                  alt="DHFLOUR" 
                  className={isMobile ? "h-16" : "h-20"}
                />
              </Link>
            </div>
            {isMobile && (
              <div className="text-left mt-1 mb-2">
                <p className="whitespace-nowrap text-white text-sm">
                  문의전화번호 :
                  <Link to={`tel:02-3455-0000`} className="text-white"> 02-3455-0000</Link>
                </p>
              </div>
            )}
          </div>
          {!isMobile && (
            <div className="ft-left">
              <div className="info text-left">
                <p className="whitespace-nowrap text-white text-xl">
                  문의전화번호 :
                  <Link to={`tel:02-3455-0000`} className="text-white"> 02-3455-0000</Link>
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="ft-bottom mt-2">
          <p className="text-sm">Copyright ⓒ 2025 대한제분(주) All right reserved.</p>
        </div>
      </div>
    </footer>
  );
};
