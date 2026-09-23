import './Home.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import {
  FaBoxes, FaFileInvoiceDollar, FaClipboardList, FaIndustry,
  FaTruck, FaShieldAlt, FaStar, FaWhatsapp, FaPhone,
  FaMapMarkerAlt, FaLock, FaUserShield, FaEye,
  FaCheckCircle, FaRupeeSign, FaEnvelope, FaBuilding,
  FaChevronRight, FaQuoteLeft, FaHandshake, FaClock,
  FaWarehouse, FaTools, FaMedal, FaFire, FaArrowRight,
  FaTimesCircle
} from 'react-icons/fa';

// ── Product categories with icons & descriptions ──
const PRODUCT_CATEGORIES = [
  { icon: '🔲', name: 'MS Square & Round Pipe', desc: 'Mild Steel pipes for all construction & fabrication needs', tag: 'Most Popular' },
  { icon: '🟡', name: 'GI Square & Round Pipe', desc: 'Galvanized iron pipes, corrosion-resistant & long-lasting', tag: '' },
  { icon: '📋', name: 'Sheet & Plate', desc: 'MS Sheets and HR/CR plates in all thicknesses', tag: '' },
  { icon: '⚙️', name: 'TMT Bar & Rod', desc: 'High-strength TMT bars for RCC construction', tag: 'Fast Moving' },
  { icon: '📐', name: 'Angle / Channel / Flat', desc: 'Structural steel sections for frames & supports', tag: '' },
  { icon: '🏠', name: 'Roofing Sheet', desc: 'Colour-coated & plain roofing sheets for industrial sheds', tag: '' },
  { icon: '🌀', name: 'Binding Wire & HDPE Pipe', desc: 'Wire for tying rods & HDPE pipes for water supply', tag: '' },
  { icon: '🧱', name: 'PVC & Puff Sheet', desc: 'PVC sheets for cladding, partitions & false ceilings', tag: '' },
];

// ── Testimonials ──
const TESTIMONIALS = [
  { name: 'Rajan Constructions', role: 'Chennai Builder', text: 'Qadri Steel has been our go-to supplier for over 8 years. Quality material, fair price, and always on time.' },
  { name: 'Praveen Fabricators', role: 'Fabrication Workshop', text: 'Best MS pipe supplier in Chennai. Their TMT bars and angles are top quality. Highly recommend!' },
  { name: 'Arun Civil Works', role: 'Civil Contractor', text: 'Reliable delivery to site. Staff is knowledgeable and always helps us pick the right specification.' },
];

// ── Locations ──
const LOCATIONS = [
  { type: 'Office', name: 'Mannady, Chennai', addr: 'Old No. 34, New No. 67, Post Office Street, Chennai — 600 001', icon: FaBuilding },
  { type: 'Godown', name: 'Royapuram', addr: 'Chennai — 600 013', icon: FaWarehouse },
  { type: 'Godown', name: 'Manalai', addr: 'Chennai — 600 068', icon: FaWarehouse },
  { type: 'Godown', name: 'Madavaram', addr: 'Chennai — 600 060', icon: FaWarehouse },
];

const Home = () => {
  const navigate = useNavigate();
  const { isManager, loginAsManager, setViewer } = useRole();

  const [products, setProducts] = useState([]);
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [mgUsername, setMgUsername] = useState('');
  const [mgPassword, setMgPassword] = useState('');
  const [mgError, setMgError] = useState('');
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', product: '', quantity: '', message: '' });
  const [inquirySent, setInquirySent] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    fetch('http://127.0.0.1:8001/products')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setProducts(d); })
      .catch(() => {});

    // Auto-rotate testimonials
    const t = setInterval(() => setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleManagerLogin = (e) => {
    e.preventDefault();
    const ok = loginAsManager(mgUsername, mgPassword);
    if (ok) { setShowManagerModal(false); setMgError(''); setMgUsername(''); setMgPassword(''); }
    else setMgError('Invalid credentials. Try again.');
  };

  const handleInquiry = (e) => {
    e.preventDefault();
    // Save inquiry to localStorage for manager to see later
    const inquiries = JSON.parse(localStorage.getItem('qst_inquiries') || '[]');
    inquiries.push({ ...inquiryForm, date: new Date().toLocaleString(), status: 'New' });
    localStorage.setItem('qst_inquiries', JSON.stringify(inquiries));
    setInquirySent(true);
    setTimeout(() => { setShowInquiryModal(false); setInquirySent(false); setInquiryForm({ name: '', phone: '', product: '', quantity: '', message: '' }); }, 2500);
  };

  
  const handleWhatsAppInquiry = (e) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.phone || !inquiryForm.product) {
      alert("Please fill out Name, Phone, and Product before sending via WhatsApp.");
      return;
    }
    const text = `WELCOME QADRI STEEL AND TUBES!\n\nI have an inquiry:\nName: ${inquiryForm.name}\nPhone: ${inquiryForm.phone}\nProduct: ${inquiryForm.product}\nQuantity: ${inquiryForm.quantity}\nRequirements: ${inquiryForm.message}`;
    const url = `https://wa.me/919384902028?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    
    // Save internally as well
    const inquiries = JSON.parse(localStorage.getItem('qst_inquiries') || '[]');
    inquiries.push({ ...inquiryForm, date: new Date().toLocaleString(), status: 'WhatsApp' });
    localStorage.setItem('qst_inquiries', JSON.stringify(inquiries));
    
    setInquirySent(true);
    setTimeout(() => { setShowInquiryModal(false); setInquirySent(false); setInquiryForm({ name: '', phone: '', product: '', quantity: '', message: '' }); }, 2500);
  };

  const inStock = products.filter(p => p.stock_status === 'In Stock').length;
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="home-page">

      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero-bg">
          <img src="/truck-pipes.jpg" alt="Warehouse Background" className="hero-shop-img" style={{opacity: 0.15}} />
          <div className="hero-overlay" />
        </div>
        <div className="home-hero-content">
          <span className="hero-badge-home">📍 Est. Chennai — Mannady, Royapuram, Manalai & Madavaram</span>
          <h1>Qadri Steel <span className="amp">&</span> Tubes</h1>
          <p className="hero-tagline">ماشاءالله — Steel That Builds Your Future</p>
          <p className="hero-desc">
            Chennai's trusted dealer in <strong>MS Pipes, GI Pipes, TMT Bars, Roofing Sheets, Angles, Channels</strong> and all steel building materials. Quality guaranteed. Fast delivery across Chennai.
          </p>

          {/* Role strip */}
          <div className="hero-role-strip">
            {isManager ? (
              <div className="role-badge manager">
                <FaUserShield /> Manager Mode Active
                <button className="role-switch-btn viewer" onClick={() => setViewer()}>Switch to Viewer</button>
              </div>
            ) : (
              <div className="role-badge viewer-badge">
                <FaEye /> You are browsing as Customer
                <button className="role-switch-btn manager-btn" onClick={() => setShowManagerModal(true)}>
                  <FaLock /> Staff Login
                </button>
              </div>
            )}
          </div>

          <div className="hero-actions">
            <button className="btn-gold" onClick={() => navigate('/catalog')}>
              Browse Catalog <FaArrowRight />
            </button>
            <button className="btn-outline" onClick={() => document.dispatchEvent(new CustomEvent('open-inquiry-modal'))}>
              <FaWhatsapp /> Request a Quote
            </button>
            {isManager && (
              <button className="btn-green" onClick={() => navigate('/quotes')}>
                <FaFileInvoiceDollar /> Create Quotation
              </button>
            )}
          </div>
        </div>
        <div className="hero-truck-img-wrap">
          <img src="/poster.jpg" alt="1 Year Anniversary" className="hero-truck-img" style={{borderRadius: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.5)"}} />
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <div className="trust-strip-home">
        <div className="trust-item"><FaTruck /><span>Fast Delivery Across Chennai</span></div>
        <div className="trust-item"><FaShieldAlt /><span>Quality Guaranteed</span></div>
        <div className="trust-item"><FaStar /><span>10+ Years Trusted</span></div>
        <div className="trust-item"><FaWhatsapp /><span>24/7 WhatsApp Support</span></div>
        <div className="trust-item"><FaHandshake /><span>Bulk Discounts Available</span></div>
      </div>

      {/* ── Quick Stats ── */}
      <section className="home-stats">
        <div className="stat-card-home">
          <div className="stat-icon-home gold"><FaBoxes /></div>
          <div><h3>{products.length || '50'}+</h3><p>Products Listed</p></div>
        </div>
        <div className="stat-card-home">
          <div className="stat-icon-home green"><FaCheckCircle /></div>
          <div><h3>{inStock || '40'}+</h3><p>Items In Stock</p></div>
        </div>
        <div className="stat-card-home">
          <div className="stat-icon-home orange"><FaWarehouse /></div>
          <div><h3>4</h3><p>Locations</p></div>
        </div>
        <div className="stat-card-home">
          <div className="stat-icon-home blue"><FaMedal /></div>
          <div><h3>10+</h3><p>Years in Business</p></div>
        </div>
      </section>

      {/* ── About Us ── */}
      <section className="about-section">
        <div className="about-left">
          <div className="about-img-grid">
            <img src="/truck-pipes.jpg" alt="Qadri Steel Delivery" className="about-img main-img" />
            <img src="/pipes-hand.png" alt="Steel Pipes" className="about-img side-img" style={{height: '140px'}} />
            <img src="/roofing-sheet.png" alt="Roofing Sheets" className="about-img side-img" style={{height: '140px'}} />
          </div>
        </div>
        <div className="about-right">
          <span className="section-badge">About Us</span>
          <h2>Chennai's Trusted Steel Partner Since Over a Decade</h2>
          <p>
            <strong>Qadri Steel &amp; Tubes</strong> is a leading steel dealership based in Mannady, Chennai, serving builders, fabricators, civil contractors, and individuals across the city. We stock a wide range of steel products from trusted brands like <strong>Tata Steel, APL Apollo, MPL, JSW</strong>, and more.
          </p>
          <p>
            With <strong>4 locations across Chennai</strong> — our main office at Mannady and godowns at Royapuram, Manalai, and Madavaram — we ensure quick availability and fast delivery to your construction site or workshop.
          </p>
          <div className="about-points">
            <div className="about-point"><FaCheckCircle className="check-icon" /> Competitive wholesale &amp; retail pricing</div>
            <div className="about-point"><FaCheckCircle className="check-icon" /> All major brands available under one roof</div>
            <div className="about-point"><FaCheckCircle className="check-icon" /> Doorstep delivery across Chennai</div>
            <div className="about-point"><FaCheckCircle className="check-icon" /> Expert guidance for the right specification</div>
            <div className="about-point"><FaCheckCircle className="check-icon" /> GST billing &amp; transparent pricing</div>
          </div>
          <div className="about-contact-row">
            <a href="tel:9384902028" className="contact-pill phone"><FaPhone /> 9384902028</a>
            <a href="https://wa.me/919384902028" target="_blank" rel="noreferrer" className="contact-pill whatsapp"><FaWhatsapp /> WhatsApp</a>
          </div>
        </div>
      </section>

      {/* ── Products Grid ── */}
      <section className="products-section">
        <div className="section-header-row">
          <div>
            <span className="section-badge">Our Products</span>
            <h2>Complete Steel Range</h2>
            <p className="section-sub">Everything you need for construction, fabrication &amp; industrial use</p>
          </div>
          <button className="view-all-btn" onClick={() => navigate('/catalog')}>View Full Catalog <FaChevronRight /></button>
        </div>
        <div className="products-grid-home">
          {PRODUCT_CATEGORIES.map((cat, i) => (
            <div key={i} className="product-card-home" onClick={() => navigate('/catalog')}>
              {cat.tag && <span className="product-tag">{cat.tag === 'Most Popular' ? <><FaFire /> {cat.tag}</> : <><FaArrowRight /> {cat.tag}</>}</span>}
              <div className="product-emoji">{cat.icon}</div>
              <h3>{cat.name}</h3>
              <p>{cat.desc}</p>
              <div className="product-cta">Check Price <FaChevronRight /></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Manager Dashboard Quick Access (only for manager) ── */}
      {isManager && (
        <section className="manager-panel-section">
          <div className="section-header-row">
            <div>
              <span className="section-badge manager-badge-title">Manager Tools</span>
              <h2>Business Management</h2>
              <p className="section-sub">Quick access to all business operations</p>
            </div>
          </div>
          <div className="manager-tools-grid">
            <div className="manager-tool-card" onClick={() => navigate('/quotes')}>
              <FaFileInvoiceDollar className="mt-icon" />
              <div>
                <h4>Create Quotation</h4>
                <p>Generate &amp; share professional quotes</p>
              </div>
              <FaChevronRight className="mt-arrow" />
            </div>
            <div className="manager-tool-card" onClick={() => navigate('/orders')}>
              <FaClipboardList className="mt-icon" />
              <div>
                <h4>Manage Orders</h4>
                <p>Track &amp; update customer orders</p>
              </div>
              <FaChevronRight className="mt-arrow" />
            </div>
            <div className="manager-tool-card" onClick={() => navigate('/catalog')}>
              <FaBoxes className="mt-icon" />
              <div>
                <h4>Product Catalog</h4>
                <p>Add, edit &amp; manage products</p>
              </div>
              <FaChevronRight className="mt-arrow" />
            </div>
            <div className="manager-tool-card" onClick={() => {
              const inqs = JSON.parse(localStorage.getItem('qst_inquiries') || '[]');
              alert(inqs.length === 0 ? 'No customer inquiries yet.' : inqs.map((q,i) => `${i+1}. ${q.name} (${q.phone}) — ${q.product} ${q.quantity}\n   "${q.message}"\n   Date: ${q.date}`).join('\n\n'));
            }}>
              <FaEnvelope className="mt-icon" />
              <div>
                <h4>Customer Inquiries</h4>
                <p>View quote requests from customers</p>
              </div>
              <FaChevronRight className="mt-arrow" />
            </div>
            <div className="manager-tool-card" onClick={() => navigate('/brands')}>
              <FaIndustry className="mt-icon" />
              <div>
                <h4>Brands &amp; Live Rates</h4>
                <p>Manage supplier info &amp; market rates</p>
              </div>
              <FaChevronRight className="mt-arrow" />
            </div>
            <div className="manager-tool-card" onClick={() => navigate('/dashboard')}>
              <FaTools className="mt-icon" />
              <div>
                <h4>Full Dashboard</h4>
                <p>Analytics, reports &amp; overview</p>
              </div>
              <FaChevronRight className="mt-arrow" />
            </div>
          </div>
        </section>
      )}

      {/* ── Customer Quick Actions (only for viewer) ── */}
      {!isManager && (
        <section className="customer-actions-section">
          <div className="section-header-row">
            <div>
              <span className="section-badge">For Customers</span>
              <h2>What Would You Like To Do?</h2>
              <p className="section-sub">Browse, inquire, and get the best steel prices in Chennai</p>
            </div>
          </div>
          <div className="customer-actions-grid">
            <div className="customer-action-card" onClick={() => navigate('/catalog')}>
              <div className="ca-icon"><FaBoxes /></div>
              <h3>Browse Products</h3>
              <p>View our full catalog with specifications and current prices</p>
              <button className="ca-btn">View Catalog <FaChevronRight /></button>
            </div>
            <div className="customer-action-card highlight" onClick={() => document.dispatchEvent(new CustomEvent('open-inquiry-modal'))}>
              <div className="ca-icon"><FaFileInvoiceDollar /></div>
              <h3>Request a Quote</h3>
              <p>Send your requirements and we'll prepare a detailed quotation within 30 minutes</p>
              <button className="ca-btn gold">Get Quote <FaChevronRight /></button>
            </div>
            <div className="customer-action-card" onClick={() => navigate('/orders')}>
              <div className="ca-icon"><FaTruck /></div>
              <h3>Track My Order</h3>
              <p>Check the status of your delivery and order progress</p>
              <button className="ca-btn">Track Order <FaChevronRight /></button>
            </div>
            <div className="customer-action-card" onClick={() => window.open('https://wa.me/919384902028?text=Hello%20Qadri%20Steel,%20I%20need%20a%20quote%20for%20steel%20materials', '_blank')}>
              <div className="ca-icon green"><FaWhatsapp /></div>
              <h3>WhatsApp Us</h3>
              <p>Chat directly with our team for prices, availability and bulk orders</p>
              <button className="ca-btn green">Open WhatsApp <FaChevronRight /></button>
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      <section className="testimonials-section">
        <span className="section-badge center-badge">What Our Customers Say</span>
        <h2 className="center-h2">Trusted By Builders &amp; Fabricators</h2>
        <div className="testimonial-carousel">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`testimonial-card ${i === activeTestimonial ? 'active' : ''}`}>
              <FaQuoteLeft className="quote-icon-t" />
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.name[0]}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="testimonial-dots">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} className={`t-dot ${i === activeTestimonial ? 'active' : ''}`} onClick={() => setActiveTestimonial(i)} />
          ))}
        </div>
      </section>

      {/* ── Our Locations ── */}
      <section className="locations-section">
        <span className="section-badge center-badge">Find Us</span>
        <h2 className="center-h2">Our Locations Across Chennai</h2>
        <div className="locations-grid">
          {LOCATIONS.map((loc, i) => (
            <div key={i} className={`location-card ${loc.type === 'Office' ? 'office-card' : ''}`}>
              <div className="loc-type-badge">{loc.type}</div>
              <loc.icon className="loc-icon" />
              <h3>{loc.name}</h3>
              <p>{loc.addr}</p>
              {loc.type === 'Office' && (
                <div className="office-contacts">
                  <a href="tel:9384902028" className="loc-contact"><FaPhone /> 9384902028</a>
                  <a href="tel:8610388075" className="loc-contact"><FaPhone /> 86103 88075</a>
                  <a href="mailto:qadristeeltubes@gmail.com" className="loc-contact"><FaEnvelope /> qadristeeltubes@gmail.com</a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="home-cta-footer">
        <div className="cta-content">
          <h2>Need Steel Materials? We'll Deliver to Your Site.</h2>
          <p>Call us or WhatsApp now for prices, bulk orders, and fast delivery across Chennai</p>
          <div className="cta-buttons">
            <a href="tel:9384902028" className="cta-btn phone"><FaPhone /> Call: 9384902028</a>
            <a href="https://wa.me/919384902028" target="_blank" rel="noreferrer" className="cta-btn whatsapp"><FaWhatsapp /> WhatsApp Us</a>
            <button className="cta-btn quote" onClick={() => document.dispatchEvent(new CustomEvent('open-inquiry-modal'))}><FaFileInvoiceDollar /> Request Quote Online</button>
          </div>
        </div>
      </section>

      {/* ── Manager Login Modal ── */}
      {showManagerModal && (
        <div className="modal-overlay" onClick={() => { setShowManagerModal(false); setMgError(''); }}>
          <div className="manager-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-x" onClick={() => { setShowManagerModal(false); setMgError(''); }}><FaTimesCircle /></button>
            <div className="modal-header">
              <FaUserShield className="modal-icon" />
              <h2>Staff / Manager Login</h2>
              <p>Enter credentials to access management tools</p>
            </div>
            <form onSubmit={handleManagerLogin} className="modal-form">
              <div className="modal-input-group">
                <label>Username</label>
                <input type="text" placeholder="Enter username" value={mgUsername} onChange={e => setMgUsername(e.target.value)} required autoFocus />
              </div>
              <div className="modal-input-group">
                <label>Password</label>
                <input type="password" placeholder="Enter password" value={mgPassword} onChange={e => setMgPassword(e.target.value)} required />
              </div>
              {mgError && <div className="modal-error"><FaTimesCircle /> {mgError}</div>}
              <button type="submit" className="modal-submit">Login as Manager</button>
              <button type="button" className="modal-cancel" onClick={() => { setShowManagerModal(false); setMgError(''); }}>
                Continue as Customer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Customer Inquiry Modal ── */}
      {showInquiryModal && (
        <div className="modal-overlay" onClick={() => setShowInquiryModal(false)}>
          <div className="inquiry-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-x" onClick={() => setShowInquiryModal(false)}><FaTimesCircle /></button>
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
                <form onSubmit={handleInquiry} className="modal-form">
                  <div className="form-row-2">
                    <div className="modal-input-group">
                      <label>Your Name *</label>
                      <input type="text" placeholder="Full name" value={inquiryForm.name} onChange={e => setInquiryForm({...inquiryForm, name: e.target.value})} required />
                    </div>
                    <div className="modal-input-group">
                      <label>Phone Number *</label>
                      <input type="tel" placeholder="10-digit mobile" value={inquiryForm.phone} onChange={e => setInquiryForm({...inquiryForm, phone: e.target.value})} required />
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div className="modal-input-group">
                      <label>Product Required *</label>
                      <select value={inquiryForm.product} onChange={e => setInquiryForm({...inquiryForm, product: e.target.value})} required>
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
                    <button type="submit" className="modal-submit gold-submit" style={{flex: 1}}>
                      Send Online
                    </button>
                  </div>

                  <p className="inquiry-note">📞 Or call us directly: <strong>9384902028</strong> | <strong>86103 88075</strong></p>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
