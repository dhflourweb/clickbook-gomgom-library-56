
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import BookRentals from "./pages/BookRentals";
import MyPage from "./pages/MyPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle admin redirection
const HomeRoute = () => {
  const { hasRole } = useAuth();
  
  // Redirect admin users directly to admin dashboard
  if (hasRole(['admin', 'system_admin'])) {
    return <Navigate to="/admin" replace />;
  }
  
  return <Home />;
};

// Component to handle admin dashboard access
const AdminRoute = () => {
  const { hasRole } = useAuth();
  
  if (!hasRole(['admin', 'system_admin'])) {
    return <Navigate to="/" replace />;
  }
  
  return <AdminDashboard />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<HomeRoute />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/books/rentals" element={<BookRentals />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/admin" element={<AdminRoute />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
