import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Header from '../Header';
import { Outlet } from 'react-router-dom';
import RocketTransition from '../RocketTransition';
import PriceTicker from '../PriceTicker/PriceTicker';
import FloatingActions from '../FloatingActions/FloatingActions';
import ProgressBar, { ScrollToTop } from '../ProgressBar/ProgressBar';
import ToastProvider from '../Toast/Toast';
import GlobalInquiryModal from '../GlobalInquiryModal';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Global: Rocket flies on tab switch */}
      <RocketTransition />
      {/* Global: Gold progress bar on page load */}
      <ProgressBar />
      {/* Global: Toast notifications */}
      <ToastProvider />
      <GlobalInquiryModal />
      {/* Global: Floating WhatsApp/Call/Quote buttons */}
      <FloatingActions />
      {/* Global: Scroll to top */}
      <ScrollToTop />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 150 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        {/* Steel price ticker below header */}
        <PriceTicker />
        <div className="workspace">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
