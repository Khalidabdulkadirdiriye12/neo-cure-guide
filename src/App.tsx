import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Index from "./pages/Index";
import TumorDetection from "./pages/TumorDetection";
import SurvivalPrediction from "./pages/SurvivalPrediction";
import Predictions from "./pages/Predictions";
import PredictionsHistory from "./pages/PredictionsHistory";
import PatientManagement from "./pages/PatientManagement";
import DoctorManagement from "./pages/DoctorManagement";
import UserManagement from "./pages/UserManagement";
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Auth redirect component
const AuthRedirect = () => {
  const { user, isLoading, isAdmin } = useAuth();
  
  if (isLoading) return null;
  
  if (!user) return <Navigate to="/login" replace />;
  
  return <Navigate to={isAdmin ? "/admin-dashboard" : "/dashboard"} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<AuthRedirect />} />
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requireDoctor>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/treatment-recommender"
                element={
                  <ProtectedRoute requireDoctor>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tumor-detection" 
                element={
                  <ProtectedRoute requireDoctor>
                    <TumorDetection />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/survival-prediction" 
                element={
                  <ProtectedRoute requireDoctor>
                    <SurvivalPrediction />
                  </ProtectedRoute>
                } 
              />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/predictions-history" element={<PredictionsHistory />} />
              <Route path="/patient-management" element={<PatientManagement />} />
              <Route path="/doctor-management" element={<DoctorManagement />} />
              <Route
                path="/user-management" 
                element={
                  <ProtectedRoute requireAdmin>
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
