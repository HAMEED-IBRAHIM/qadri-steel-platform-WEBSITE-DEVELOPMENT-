import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ProjectProvider } from "./context/ProjectContext";
import { RoleProvider } from "./context/RoleContext";
import Home from "./pages/Home/Home";
import Initialize from "./pages/Initialize/Initialize";
import Welcome from "./pages/Welcome/Welcome";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import MainLayout from "./components/layout/MainLayout";
import Designer from "./pages/Designer/Designer";
import Dashboard from "./pages/Dashboard/Dashboard";
import Predictions from "./pages/Predictions/Predictions";
import Database from "./pages/Database/Database";
import Literature from "./pages/Literature/Literature";
import Experiments from "./pages/Experiments/Experiments";
import Assistant from "./pages/Assistant/Assistant";
import Profile from './pages/Profile/Profile';
import Settings from "./pages/Settings/Settings";
import KnowledgeBase from "./pages/KnowledgeBase/KnowledgeBase";
import Projects from "./pages/Projects/Projects.jsx";
import Calculator from "./pages/Calculator/Calculator";
import ProtectedRoute from "./components/ProtectedRoute";
import { getCurrentUser, isAuthenticated } from "./services/authService";
import "./styles/layout.css";


function App() {
  const [appInitializing, setAppInitializing] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      if (isAuthenticated()) {
        try {
          await getCurrentUser();
        } catch (err) {
          console.error("Session verification failed:", err);
        }
      }
      setAppInitializing(false);
    };
    verifySession();
  }, []);

  if (appInitializing) {
    return (
      <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#000', overflow: 'hidden' }}>
        <img 
          src="/loading_banner.jpg" 
          alt="Loading Qadri Steel..." 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.9' }} 
        />
        <div style={{ position: 'absolute', bottom: '40px', left: '0', right: '0', textAlign: 'center', zIndex: 10 }}>
          <div className="session-loader" style={{ border: '4px solid rgba(255, 255, 255, 0.2)', borderTop: '4px solid #fff', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 10px auto' }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ color: '#fff', fontSize: '14px', letterSpacing: '2px', fontWeight: '500', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>INITIALIZING DATABASE...</p>
        </div>
      </div>
    );
  }

  return (
    <ProjectProvider>
    <RoleProvider>
      {/* Main application router */}
      <Router>
        <Routes>
          {/* Public Routes - standalone, no sidebar/header */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/initialize" element={<Initialize />} />
          <Route path="/welcome" element={<Welcome />} />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Protected Routes - wrapped in ProtectedRoute and MainLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/catalog" element={<Database />} />
              <Route path="/quotes" element={<Designer />} />
              <Route path="/orders" element={<Projects />} />
              <Route path="/brands" element={<Literature />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/designer" element={<Designer />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/database" element={<Database />} />
              <Route path="/literature" element={<Literature />} />
              <Route path="/experiments" element={<Experiments />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/knowledge-base" element={<KnowledgeBase />} />
              <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
              <Route path="/calculator" element={<Calculator />} />
            </Route>
          </Route>

          {/* Catch-all: redirect unknown paths to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      </RoleProvider>
    </ProjectProvider>
  );
}

export default App;