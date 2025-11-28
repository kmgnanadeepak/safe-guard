import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";

import Dashboard from "./pages/Dashboard";
import FallDetected from "./pages/FallDetected";
import AlertSent from "./pages/AlertSent";
import LiveLocation from "./pages/LiveLocation";
import History from "./pages/History";
import Sensors from "./pages/Sensors";
import Settings from "./pages/Settings";
import EmergencyContacts from "./pages/EmergencyContacts";
import Chatbot from "./pages/Chatbot";
import Onboarding from "./pages/Onboarding";
import BottomNav from "./components/BottomNav";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const showBottomNav = ["/", "/history", "/sensors", "/settings"].includes(
    location.pathname
  );

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("onboarding-complete");

    // If onboarding not completed and user is at root, send to onboarding
    if (!hasCompletedOnboarding && location.pathname === "/") {
      navigate("/onboarding", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/fall-detected" element={<FallDetected />} />
        <Route path="/alert-sent" element={<AlertSent />} />
        <Route path="/live-location" element={<LiveLocation />} />
        <Route path="/history" element={<History />} />
        <Route path="/sensors" element={<Sensors />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/emergency-contacts" element={<EmergencyContacts />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
