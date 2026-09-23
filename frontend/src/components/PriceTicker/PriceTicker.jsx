import React, { useState } from 'react';
import { useRole } from '../../context/RoleContext';
import './PriceTicker.css';

const DEFAULT_PRICES = [
  { label: 'MS Square Pipe 1"', price: '₹68/kg' },
  { label: 'MS Round Pipe 1"', price: '₹70/kg' },
  { label: 'TMT Rod 8mm', price: '₹62/kg' },
  { label: 'GI Pipe 1"', price: '₹105/kg' },
  { label: 'Roofing Sheet 0.5mm', price: '₹210/sqft' },
  { label: 'MS Flat 50x6', price: '₹66/kg' },
  { label: 'MS Angle 50x50x5', price: '₹67/kg' },
  { label: 'Chequered Plate 4mm', price: '₹75/kg' },
];

const PriceTicker = () => {
  const { isManager } = useRole();
  const [prices, setPrices] = useState(() => {
    const saved = localStorage.getItem('qst_prices');
    return saved ? JSON.parse(saved) : DEFAULT_PRICES;
  });
  const [editing, setEditing] = useState(false);

  const savePrices = () => {
    localStorage.setItem('qst_prices', JSON.stringify(prices));
    setEditing(false);
  };

  return (
    <div className="price-ticker-bar">
      <span className="ticker-label">📈 Live Prices</span>
      <div className="ticker-track">
        <div className="ticker-inner">
          {[...prices, ...prices].map((item, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-product">{item.label}</span>
              <span className="ticker-price">{item.price}</span>
              <span className="ticker-sep">|</span>
            </span>
          ))}
        </div>
      </div>
      {isManager && (
        <button className="ticker-edit-btn" onClick={() => setEditing(!editing)} title="Edit Prices">
          ✏️
        </button>
      )}

      {editing && isManager && (
        <div className="ticker-editor">
          <h4>Update Steel Prices</h4>
          {prices.map((item, i) => (
            <div key={i} className="ticker-editor-row">
              <input
                value={item.label}
                onChange={e => {
                  const newP = [...prices]; newP[i].label = e.target.value; setPrices(newP);
                }}
              />
              <input
                value={item.price}
                onChange={e => {
                  const newP = [...prices]; newP[i].price = e.target.value; setPrices(newP);
                }}
              />
            </div>
          ))}
          <button onClick={savePrices} className="ticker-save-btn">💾 Save Prices</button>
          <button onClick={() => setEditing(false)} className="ticker-cancel-btn">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default PriceTicker;
