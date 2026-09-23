import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBoxes, FaFileInvoiceDollar, FaClipboardList, FaArrowRight, FaIndustry, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaTruck, FaShieldAlt, FaStar } from 'react-icons/fa';
import './Welcome.css';
import shopBoard from '../../assets/images/shop_board.png';
import promoFlyer from '../../assets/images/promo_flyer.jpg';
import mplPromo from '../../assets/images/mpl_promo.jpg';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      {/* Hero with shop board */}
      <section className="welcome-hero">
        <div className="hero-bg-img">
          <img src={shopBoard} alt="Qadri Steel & Tubes Signboard" />
        </div>
        <div className="hero-inner">
          <span className="hero-badge">Est. Chennai — Dealers in MS Rod, TMT Rod & Steel Tubes</span>
          <h1>Qadri Steel & Tubes</h1>
          <p className="hero-tagline">Steel That Builds Your Future</p>
          <p className="hero-desc">Quality | Strength | Trust — Your trusted partner for MS Pipes, GI Pipes, TMT Bars, Roofing Sheets, and all steel building materials in Chennai.</p>
          <div className="hero-btns">
            <button className="hero-primary" onClick={() => navigate('/dashboard')}>
              Get Started <FaArrowRight />
            </button>
            <button className="hero-secondary" onClick={() => navigate('/dashboard')}>
              Login to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-strip">
        <div className="trust-item"><FaTruck /> <span>Timely Delivery</span></div>
        <div className="trust-item"><FaShieldAlt /> <span>Trusted Supplier</span></div>
        <div className="trust-item"><FaStar /> <span>Best Quality</span></div>
        <div className="trust-item"><FaWhatsapp /> <span>24/7 Support</span></div>
      </section>

      {/* Features */}
      <section className="welcome-features">
        <h2>Your Business, Simplified</h2>
        <p className="section-desc">Everything you need to manage your steel dealership in one platform.</p>
        <div className="features-grid">
          <div className="feature-item" onClick={() => navigate('/database')}>
            <div className="feature-icon"><FaBoxes /></div>
            <h3>Product Catalog</h3>
            <p>Browse and manage your complete steel inventory — MS Pipes, GI Pipes, Sheets, TMT Bars, Angles, Channels, and more with real-time stock levels.</p>
          </div>
          <div className="feature-item" onClick={() => navigate('/designer')}>
            <div className="feature-icon"><FaFileInvoiceDollar /></div>
            <h3>Quotations</h3>
            <p>Generate professional price quotations for customers instantly. Add products, set quantities, and share quotes with one click.</p>
          </div>
          <div className="feature-item" onClick={() => navigate('/projects')}>
            <div className="feature-icon"><FaClipboardList /></div>
            <h3>Order Tracking</h3>
            <p>Keep track of customer orders from placement to delivery. Manage payment statuses and delivery timelines.</p>
          </div>
          <div className="feature-item" onClick={() => navigate('/literature')}>
            <div className="feature-icon"><FaIndustry /></div>
            <h3>Brands & Suppliers</h3>
            <p>Manage relationships with Tata Steel, APL Apollo, MPL, JSW, and all your trusted supplier brands.</p>
          </div>
        </div>
      </section>

      {/* Gallery / Promos */}
      <section className="promo-section">
        <h2>Our Products & Brands</h2>
        <div className="promo-grid">
          <img src={promoFlyer} alt="Qadri Steel Products Range" className="promo-img" />
          <img src={mplPromo} alt="MPL Steel Pipes Partnership" className="promo-img" />
        </div>
      </section>

      {/* Contact Footer */}
      <footer className="welcome-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>Qadri Steel & Tubes</h3>
            <p className="footer-tagline">Strong Materials | Brighter Future</p>
            <p className="footer-sub">Your Partner In Every Build</p>
          </div>
          <div className="footer-contact">
            <div className="contact-item">
              <FaMapMarkerAlt />
              <div>
                <strong>Office:</strong> Parrys, Chennai<br/>
                <strong>Godown:</strong> Royapuram & Manali
              </div>
            </div>
            <div className="contact-item">
              <FaPhone />
              <span>9384902028 | 86103 88075</span>
            </div>
            <div className="contact-item">
              <FaEnvelope />
              <span>qadristeeltubes@gmail.com</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Qadri Steel & Tubes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
