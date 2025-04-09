
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";

import logo from '@/assets/images/icon_logo_df_w.svg';

export const Footer = () => {
  return (
      <footer className="footer py-4">
        <div className="container mx-auto md:px-6">
          <div className="flex items-center justify-between">
            <div className="logo">
              <Link to="/" className="block w-fit">
                <img src={logo} alt="DHFLOUR" className="h-10" />
              </Link>
            </div>
            <div className="ft-left">
              <div className="info">
                <p className="whitespace-nowrap text-white text-sm">
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
