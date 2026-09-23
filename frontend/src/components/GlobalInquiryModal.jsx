import React, { useState, useEffect } from 'react';
import { FaTimesCircle, FaCheckCircle, FaFileInvoiceDollar, FaWhatsapp } from 'react-icons/fa';

const PRODUCT_CATEGORIES = [
  { name: 'MS Pipes & Tubes' },
  { name: 'GI Pipes & Tubes' },
  { name: 'TMT Bars & Rods' },
  { name: 'Roofing Sheets & Coils' },
  { name: 'MS Angles & Channels' },
  { name: 'MS Plates & Sheets' },
  { name: 'Chequered Plates' },
  { name: 'Bright Bars & Shafts' },
  { name: 'MS Flat Bars' }
];

const GlobalInquiryModal = () => {
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', product: '', quantity: '', message: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const handleOpen = () => setShowInquiryModal(true);
    document.addEventListener('open-inquiry-modal', handleOpen);
    return () => document.removeEventListener('open-inquiry-modal', handleOpen);
  }, []);

  const validateForm = () => {
    if (!inquiryForm.name.trim() || !inquiryForm.phone.trim() || !inquiryForm.product) {
      setFormError('⚠️ Please fill in all required fields (*)');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleInquiry = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const saved = localStorage.getItem('qst_inquiries');
    const inquiries = saved ? JSON.parse(saved) : [];
    inquiries.push({ ...inquiryForm, date: new Date().toLocaleString(), status: 'New' });
    localStorage.setItem('qst_inquiries', JSON.stringify(inquiries));
    
    setInquirySent(true);
    setTimeout(() => { 
      setShowInquiryModal(false); 
      setInquirySent(false); 
      setInquiryForm({ name: '', phone: '', product: '', quantity: '', message: '' }); 
    }, 2500);
  };

  const handleWhatsAppInquiry = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const msg = `WELCOME QADRI STEEL AND TUBES!\n\nI have an inquiry:\n*Name:* ${inquiryForm.name}\n*Phone:* ${inquiryForm.phone}\n*Product:* ${inquiryForm.product}\n*Quantity:* ${inquiryForm.quantity}\n*Details:* ${inquiryForm.message}\n\nPlease let me know the availability and pricing.`;
    window.open(`https://wa.me/919384902028?text=${encodeURIComponent(msg)}`, '_blank');
    
    // Also save it locally
    const saved = localStorage.getItem('qst_inquiries');
    const inquiries = saved ? JSON.parse(saved) : [];
    inquiries.push({ ...inquiryForm, date: new Date().toLocaleString(), status: 'Sent via WA' });
    localStorage.setItem('qst_inquiries', JSON.stringify(inquiries));
    
    setInquirySent(true);
    setTimeout(() => { 
      setShowInquiryModal(false); 
      setInquirySent(false); 
      setInquiryForm({ name: '', phone: '', product: '', quantity: '', message: '' }); 
    }, 2500);
  };

  if (!showInquiryModal) return null;

  return (
    <div className="modal-overlay" onClick={() => { setShowInquiryModal(false); setFormError(''); }} style={{zIndex: 9999999}}>
      <div className="inquiry-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-x" onClick={() => { setShowInquiryModal(false); setFormError(''); }}><FaTimesCircle /></button>
        {inquirySent ? (
          <div className="inquiry-success">
            <FaCheckCircle className="success-icon" />
            <h2>Inquiry Sent!</h2>
            <p>Our team will contact you within 30 minutes. Thank you!</p>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <FaFileInvoiceDollar className="modal-icon gold-icon" />
              <h2>Request a Quote</h2>
              <p>Fill in your requirements and we'll prepare a detailed quotation</p>
            </div>
            <form className="modal-form">
              {formError && <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9rem', fontWeight: 'bold' }}>{formError}</div>}
              
              <div className="form-row-2">
                <div className="modal-input-group">
                  <label>Your Name *</label>
                  <input type="text" placeholder="Full name" value={inquiryForm.name} onChange={e => { setInquiryForm({...inquiryForm, name: e.target.value}); setFormError(''); }} required />
                </div>
                <div className="modal-input-group">
                  <label>Phone Number *</label>
                  <input type="tel" placeholder="10-digit mobile" value={inquiryForm.phone} onChange={e => { setInquiryForm({...inquiryForm, phone: e.target.value}); setFormError(''); }} required />
                </div>
              </div>
              <div className="form-row-2">
                <div className="modal-input-group">
                  <label>Product Required *</label>
                  <select value={inquiryForm.product} onChange={e => { setInquiryForm({...inquiryForm, product: e.target.value}); setFormError(''); }} required>
                    <option value="">Select product...</option>
                    {PRODUCT_CATEGORIES.map((c,i) => <option key={i} value={c.name}>{c.name}</option>)}
                    <option value="Other">Other / Multiple Items</option>
                  </select>
                </div>
                <div className="modal-input-group">
                  <label>Approximate Quantity</label>
                  <input type="text" placeholder="e.g. 50 pcs / 2 tons" value={inquiryForm.quantity} onChange={e => setInquiryForm({...inquiryForm, quantity: e.target.value})} />
                </div>
              </div>
              <div className="modal-input-group">
                <label>Additional Requirements</label>
                <textarea placeholder="Specification, size, delivery location, etc." value={inquiryForm.message} onChange={e => setInquiryForm({...inquiryForm, message: e.target.value})} rows={3} />
              </div>
              
              <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                <button type="button" className="modal-submit whatsapp-submit" onClick={handleWhatsAppInquiry} style={{flex: 1, backgroundColor: '#25D366', color: '#fff'}}>
                  <FaWhatsapp /> Send via WhatsApp
                </button>
                <button type="button" className="modal-submit gold-submit" onClick={handleInquiry} style={{flex: 1}}>
                  Send Online
                </button>
              </div>

              <p className="inquiry-note">📞 Or call us directly: <strong>9384902028</strong> | <strong>86103 88075</strong></p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default GlobalInquiryModal;
