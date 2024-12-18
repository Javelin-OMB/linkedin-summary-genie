import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Pricing from "@/pages/Pricing";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import Plan from "@/pages/Plan";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import RecentAnalyses from "@/pages/RecentAnalyses";
import HowItWorks from "@/pages/HowItWorks";
import ResetPassword from "@/components/auth/ResetPassword";

export const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Index />} />
    <Route path="/about" element={<About />} />
    <Route path="/how-it-works" element={<HowItWorks />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    
    {/* Protected routes */}
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    <Route path="/plan" element={<ProtectedRoute><Plan /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
    <Route path="/analyses" element={<ProtectedRoute><RecentAnalyses /></ProtectedRoute>} />
  </Routes>
);