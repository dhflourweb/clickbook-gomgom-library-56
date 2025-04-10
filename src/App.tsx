
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import BookRentals from "./pages/BookRentals";
import MyPage from "./pages/MyPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Announcements from "./pages/Announcements";
import AnnouncementDetail from "./pages/AnnouncementDetail";
import AnnouncementForm from "./pages/AnnouncementForm";
import Inquiries from "./pages/Inquiries";
import InquiryDetail from "./pages/InquiryDetail";
import { AdminRoute } from "./components/auth/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/books/rentals" element={<BookRentals />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypage/history" element={<MyPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/announcements/:id" element={<AnnouncementDetail />} />
            <Route 
              path="/announcements/new" 
              element={
                <AdminRoute>
                  <AnnouncementForm />
                </AdminRoute>
              } 
            />
            <Route 
              path="/announcements/:id/edit" 
              element={
                <AdminRoute>
                  <AnnouncementForm />
                </AdminRoute>
              } 
            />
            <Route path="/inquiries" element={<Inquiries />} />
            <Route path="/inquiries/:id" element={<InquiryDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
