import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Waitlist from "./pages/Waitlist";
import Careers from "./pages/Careers";
import CourseDetail from "./pages/CourseDetail";
import Admin from "./pages/Admin";
import Instructor from "./pages/Instructor";
import AdminLoginPage from "./pages/admin/AdminLogin";
import Profile from "./pages/Profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Founder-first program is the homepage. */}
            <Route path="/" element={<Home />} />
            {/* Pricing — the three tracks. */}
            <Route path="/pricing" element={<Pricing />} />
            {/* Waitlist shows at the join / create-account moment. */}
            <Route path="/waitlist" element={<Waitlist />} />
            {/* Course catalog moved off the homepage — launching later. */}
            <Route path="/courses" element={<Careers />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/*"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <Instructor />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
