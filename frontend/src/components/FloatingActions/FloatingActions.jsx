import React, { useState } from 'react';
import './FloatingActions.css';

const FloatingActions = () => {
  const [open, setOpen] = useState(false);

  const handleWhatsApp = () => {
    window.open('https://wa.me/919384902028?text=' + encodeURIComponent('Hi, I am interested in your steel products. Can you help me?'), '_blank');
  };
  const handleCall = () => { window.open('tel:+919384902028'); };
  const handleQuote = () => {
    document.dispatchEvent(new CustomEvent('open-inquiry-modal'));
  };

  return (
    <div className={`fab-container ${open ? 'fab-open' : ''}`}>
      {/* Sub buttons - shown when open */}
      <div className="fab-actions">
        <button className="fab-action-btn fab-whatsapp" onClick={handleWhatsApp} title="WhatsApp Us">
          <span className="fab-icon">💬</span>
          <span className="fab-label">WhatsApp</span>
        </button>
        <button className="fab-action-btn fab-call" onClick={handleCall} title="Call Us">
          <span className="fab-icon">📞</span>
          <span className="fab-label">Call Now</span>
        </button>
        <button className="fab-action-btn fab-quote" onClick={handleQuote} title="Request Quote">
          <span className="fab-icon">📋</span>
          <span className="fab-label">Get Quote</span>
        </button>
      </div>

      {/* Main FAB trigger */}
      <button className="fab-main" onClick={() => setOpen(!open)} title="Contact Us">
        <span className="fab-main-icon">{open ? '✕' : '🔩'}</span>
        {!open && <span className="fab-pulse" />}
      </button>
    </div>
  );
};

export default FloatingActions;
