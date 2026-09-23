import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ProgressBar.css';

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setVisible(true);
    setProgress(0);
    const t1 = setTimeout(() => setProgress(40), 50);
    const t2 = setTimeout(() => setProgress(80), 250);
    const t3 = setTimeout(() => setProgress(100), 500);
    const t4 = setTimeout(() => { setVisible(false); setProgress(0); }, 750);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [location.pathname]);

  if (!visible) return null;
  return (
    <div className="progress-bar-track">
      <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
    </div>
  );
};

export const ScrollToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);
  if (!show) return null;
  return (
    <button className="scroll-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} title="Back to top">
      ↑
    </button>
  );
};

export default ProgressBar;
