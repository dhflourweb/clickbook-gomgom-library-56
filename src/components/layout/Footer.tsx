
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            {/* Company Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/6b94e6ab-c0ab-4012-9c46-580a7f f75e452.png" 
                alt="대한제분 로고" 
                className="h-10 mr-2" 
              />
              <span className="text-xl font-bold text-primary-deepblue">대한제분</span>
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            {/* Contact Phone */}
            <div className="flex items-center text-gray-600">
              <Phone size={18} className="mr-2" />
              <span>문의전화: 02-1234-5678</span>
            </div>
            
            {/* Copyright Info */}
            <div className="text-gray-600 text-sm">
              Copyright &copy; 2025 대한제분(주) All right reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
