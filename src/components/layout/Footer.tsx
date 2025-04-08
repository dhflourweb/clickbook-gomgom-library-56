
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";

import logo from '@/assets/images/icon_logo_df_w.svg';

export const Footer = () => {
  return (
      <footer className="footer">
        <div className="container mx-auto md:px-6">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="DHFLOUR"/>
            </Link>
          </div>
          <div className="box">
            <div className="ft-left">
              <div className="info">
                <p className="whitespace-nowrap">
                  문의전화번호 :
                  <Link to={`tel:02-3455-0000`}> 02-3455-0000</Link>
                </p>
              </div>
            </div>
            <div className="ft-right">
              <ul>
              </ul>
            </div>
          </div>
          <div className="ft-bottom">
            <p>Copyright ⓒ 2025 대한제분(주) All right reserved.</p>
          </div>
        </div>
      </footer>
  );
};
