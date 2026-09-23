import React, { useState } from 'react';
import { FaIndustry, FaPhone, FaGlobe, FaCheck, FaBoxes, FaChartLine } from 'react-icons/fa';
import './Literature.css';
import promoFlyer from '../../assets/images/promo_flyer.jpg';
import mplPromo from '../../assets/images/mpl_promo.jpg';

const brandsData = [
  { name: 'Tata Steel', logo: 'TS', color: '#0066b3', description: 'India\'s largest steel producer. Premium quality TMT bars, sheets, and structural steel.', products: ['TMT Bars (Tiscon)', 'HR Sheets', 'CR Sheets', 'GP Sheets', 'Structural Steel'], contact: '1800-209-8787', website: 'www.tatasteel.com', status: 'Active Supplier' },
  { name: 'APL Apollo', logo: 'APL', color: '#e63946', description: 'India\'s largest structural steel tube manufacturer. Wide range of MS and GI pipes.', products: ['MS Square Pipe', 'MS Round Pipe', 'MS Rectangular Pipe', 'GI Pipe', 'Hollow Sections'], contact: '1800-103-0304', website: 'www.aplapollo.com', status: 'Active Supplier' },
  { name: 'MPL Steel', logo: 'MPL', color: '#2d6a4f', description: 'Trusted steel pipe manufacturer. Strength for generations with quality MS and GI pipes.', products: ['MS Square Pipe', 'MS Rectangular Pipe', 'MS Round Pipe', 'GI Pipes'], contact: '044-25301234', website: 'www.mplsteel.com', status: 'Active Supplier' },
  { name: 'JSW Steel', logo: 'JSW', color: '#1d3557', description: 'Leading integrated steel manufacturer. Premium roofing solutions and color-coated sheets.', products: ['Color Coated Sheets', 'Galvanized Sheets', 'TMT Bars (Neosteel)', 'HR Coils'], contact: '1800-102-2124', website: 'www.jsw.in', status: 'Active Supplier' },
  { name: 'Weld Shield', logo: 'WS', color: '#b91c1c', description: 'Premium welding rods and binding wires for structural integrity.', products: ['Welding Rods', 'Binding Wires', 'Accessories'], contact: '1800-456-7890', website: 'www.weldshield.com', status: 'Active Supplier' },
];

const liveRates = [
  { material: 'MS Square Pipe', rate: 'Rs. 72 / kg', trend: '+1.2%', trendType: 'up' },
  { material: 'MS Round Pipe', rate: 'Rs. 70 / kg', trend: '+0.5%', trendType: 'up' },
  { material: 'GI Square Pipe', rate: 'Rs. 85 / kg', trend: '-0.8%', trendType: 'down' },
  { material: 'TMT Bar (12mm)', rate: 'Rs. 68 / kg', trend: '0.0%', trendType: 'flat' },
  { material: 'Roofing Sheet (Color)', rate: 'Rs. 110 / running ft', trend: '+2.1%', trendType: 'up' },
  { material: 'MS Angle', rate: 'Rs. 65 / kg', trend: '-0.3%', trendType: 'down' },
  { material: 'Binding Wire', rate: 'Rs. 75 / kg', trend: '+0.1%', trendType: 'up' },
  { material: 'PVC Sheet', rate: 'Rs. 120 / sq ft', trend: '0.0%', trendType: 'flat' },
  { material: 'Puff Sheet', rate: 'Rs. 250 / sq ft', trend: '+1.5%', trendType: 'up' },
  { material: 'HDPE Pipe', rate: 'Rs. 95 / kg', trend: '-1.0%', trendType: 'down' },
  { material: 'MS Channel', rate: 'Rs. 66 / kg', trend: '+0.2%', trendType: 'up' },
  { material: 'MS Flat', rate: 'Rs. 64 / kg', trend: '0.0%', trendType: 'flat' },
];

const Brands = () => {
  const [selectedBrand, setSelectedBrand] = useState(brandsData[0]);
  const [activeTab, setActiveTab] = useState('brands');

  return (
    <div className="brands-page">
      <div className="brands-header">
        <div>
          <h1>Directory & Live Rates</h1>
          <p>Manage your supplier partnerships, product catalogs, and track live market rates.</p>
        </div>
      </div>

      <div className="brands-tabs">
        <button className={`tab-btn ${activeTab === 'brands' ? 'active' : ''}`} onClick={() => setActiveTab('brands')}>
          <FaIndustry /> Brand Directory
        </button>
        <button className={`tab-btn ${activeTab === 'catalogs' ? 'active' : ''}`} onClick={() => setActiveTab('catalogs')}>
          <FaBoxes /> Product Matrix & Catalogs
        </button>
        <button className={`tab-btn ${activeTab === 'rates' ? 'active' : ''}`} onClick={() => setActiveTab('rates')}>
          <FaChartLine /> Live Market Rates
        </button>
      </div>

      {activeTab === 'brands' && (
        <div className="brands-layout">
          <div className="brand-list">
            {brandsData.map(b => (
              <div
                key={b.name}
                className={`brand-card ${selectedBrand.name === b.name ? 'selected' : ''}`}
                onClick={() => setSelectedBrand(b)}
              >
                <div className="brand-logo" style={{ background: b.color }}>{b.logo}</div>
                <div className="brand-info">
                  <h4>{b.name}</h4>
                  <span className={`supplier-status ${b.status === 'Active Supplier' ? 'active' : 'occasional'}`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="brand-detail">
            <div className="detail-top">
              <div className="detail-logo" style={{ background: selectedBrand.color }}>{selectedBrand.logo}</div>
              <div>
                <h2>{selectedBrand.name}</h2>
                <span className={`supplier-status ${selectedBrand.status === 'Active Supplier' ? 'active' : 'occasional'}`}>
                  {selectedBrand.status}
                </span>
              </div>
            </div>
            <p className="brand-desc">{selectedBrand.description}</p>

            <div className="detail-section">
              <h4>Products We Stock</h4>
              <div className="product-chips">
                {selectedBrand.products.map(p => (
                  <span className="product-chip" key={p}><FaCheck /> {p}</span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h4>Contact</h4>
              <div className="contact-rows">
                <div className="contact-row"><FaPhone /> {selectedBrand.contact}</div>
                <div className="contact-row"><FaGlobe /> {selectedBrand.website}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'catalogs' && (
        <div className="catalogs-grid">
          <div className="catalog-card">
            <img src={promoFlyer} alt="Qadri Steel Full Product Matrix" />
            <h4>Full Product Matrix</h4>
            <p>Comprehensive matrix of MS/GI pipes, Sheets, TMT, Plates, and Profiles available.</p>
          </div>
          <div className="catalog-card">
            <img src={mplPromo} alt="MPL Steel Pipes Catalog" />
            <h4>MPL Steel Pipes Catalog</h4>
            <p>Detailed sizing for 72x72, 60x40, 40x40 Square and Rectangular Pipes.</p>
          </div>
        </div>
      )}

      {activeTab === 'rates' && (
        <div className="rates-container">
          <div className="rates-card">
            <h3>Live Market Material Rates</h3>
            <p className="rates-subtitle">Prices are indicative and subject to daily market fluctuations. Last updated: Today, 10:00 AM.</p>
            <div className="rates-table">
              <div className="rt-header">
                <span>Material Name</span>
                <span>Current Rate</span>
                <span>24h Trend</span>
              </div>
              {liveRates.map(rate => (
                <div className="rt-row" key={rate.material}>
                  <span className="rt-name">{rate.material}</span>
                  <span className="rt-price">{rate.rate}</span>
                  <span className={`rt-trend ${rate.trendType}`}>{rate.trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;
