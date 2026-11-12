import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import "./styles/index.css";
import "./styles/universe.css";
import "./styles/admin.css";
import "./styles/chatbot.css";

export default function App() {
  const [currentView, setCurrentView] = useState("home"); // "home" | "admin-login" | "admin-dashboard"
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("leha_admin_token");
    if (token) {
      setAdminUser({ token });
    }

    // Check hash for #admin routing
    if (window.location.hash === "#admin") {
      if (token) {
        setCurrentView("admin-dashboard");
      } else {
        setCurrentView("admin-login");
      }
    }
  }, []);

  const handleOpenAdmin = () => {
    const token = localStorage.getItem("leha_admin_token");
    if (token) {
      setCurrentView("admin-dashboard");
    } else {
      setCurrentView("admin-login");
    }
  };

  const handleLoginSuccess = (userData) => {
    setAdminUser(userData);
    setCurrentView("admin-dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("leha_admin_token");
    setAdminUser(null);
    setCurrentView("home");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
  };

  return (
    <div className="digital-universe-app">
      {currentView === "home" && <HomePage onOpenAdmin={handleOpenAdmin} />}

      {currentView === "admin-login" && (
        <AdminLoginPage
          onLoginSuccess={handleLoginSuccess}
          onBackToHome={handleBackToHome}
        />
      )}

      {currentView === "admin-dashboard" && (
        <AdminDashboardPage
          onLogout={handleLogout}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
}
