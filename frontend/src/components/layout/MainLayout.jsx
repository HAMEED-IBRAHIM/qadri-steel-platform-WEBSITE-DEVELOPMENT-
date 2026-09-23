import React from 'react';
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

      <Sidebar />
      <div className="main-content">
        <Header />
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
