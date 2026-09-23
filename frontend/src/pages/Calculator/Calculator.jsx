import React, { useState } from 'react';
import './Calculator.css';

const PRODUCTS = [
  { name: 'MS Square Pipe', unit: 'mm', formula: 'square_pipe', ratePerKg: 68 },
  { name: 'MS Round Pipe', unit: 'mm', formula: 'round_pipe', ratePerKg: 70 },
  { name: 'MS Solid Round Bar', unit: 'mm', formula: 'round_bar', ratePerKg: 65 },
  { name: 'MS Flat Bar', unit: 'mm', formula: 'flat_bar', ratePerKg: 66 },
  { name: 'MS Angle (Equal)', unit: 'mm', formula: 'angle', ratePerKg: 67 },
  { name: 'TMT Rod', unit: 'mm', formula: 'round_bar', ratePerKg: 62 },
  { name: 'GI Pipe', unit: 'mm', formula: 'round_pipe', ratePerKg: 105 },
  { name: 'Roofing Sheet (per sqft)', unit: 'sqft', formula: 'sheet', ratePerKg: 210 },
];

const DENSITY = 7.85; // g/cm³ for steel

const calcWeight = (product, dim1, dim2, thickness, length, qty) => {
  const L = parseFloat(length) || 0;
  const q = parseFloat(qty) || 1;
  const d1 = parseFloat(dim1) || 0;
  const d2 = parseFloat(dim2) || 0;
  const t = parseFloat(thickness) || 0;
  let weightPerMetre = 0;

  switch (product.formula) {
    case 'square_pipe': // outer size (mm) x thickness (mm)
      weightPerMetre = ((d1 * d1) - ((d1 - 2*t) * (d1 - 2*t))) * DENSITY / 1000;
      break;
    case 'round_pipe': // outer dia (mm) x thickness (mm)
      const r_out = d1 / 2, r_in = (d1 - 2*t) / 2;
      weightPerMetre = Math.PI * (r_out*r_out - r_in*r_in) * DENSITY / 1000;
      break;
    case 'round_bar': // dia (mm)
      weightPerMetre = Math.PI * (d1/2) * (d1/2) * DENSITY / 1000;
      break;
    case 'flat_bar': // width x thickness (mm)
      weightPerMetre = d1 * t * DENSITY / 1000;
      break;
    case 'angle': // size x thickness (mm)
      weightPerMetre = (2 * d1 - t) * t * DENSITY / 1000;
      break;
    case 'sheet': // per sqft rate
      return { weight: L * q, cost: L * q * product.ratePerKg };
    default:
      break;
  }

  const totalWeight = weightPerMetre * L * q;
  const totalCost = totalWeight * product.ratePerKg;
  return { weight: totalWeight, cost: totalCost };
};

const Calculator = () => {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [dim1, setDim1] = useState('');
  const [dim2, setDim2] = useState('');
  const [thickness, setThickness] = useState('');
  const [length, setLength] = useState('');
  const [qty, setQty] = useState('1');
  const [result, setResult] = useState(null);

  const handleCalc = () => {
    const r = calcWeight(selectedProduct, dim1, dim2, thickness, length, qty);
    setResult(r);
  };

  const handleWhatsAppQuote = () => {
    if (!result) return;
    const msg = `Hello Qadri Steel & Tubes!\n\nI need a quote for:\n📦 Product: ${selectedProduct.name}\n📏 Dimensions: ${dim1}${dim2 ? ' x ' + dim2 : ''}mm${thickness ? ', Thickness: ' + thickness + 'mm' : ''}\n📐 Length: ${length}m x Qty: ${qty}\n⚖️ Est. Weight: ${result.weight.toFixed(2)} kg\n💰 Est. Cost: ₹${result.cost.toFixed(0)}\n\nPlease confirm price and availability.`;
    window.open(`https://wa.me/919384902028?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const needsThickness = ['square_pipe','round_pipe','flat_bar','angle'].includes(selectedProduct.formula);
  const isSheet = selectedProduct.formula === 'sheet';

  return (
    <div className="calc-page">
      <div className="calc-header">
        <h1>⚖️ Steel Calculator</h1>
        <p>Calculate weight & cost instantly — for any steel product</p>
      </div>

      <div className="calc-body">
        <div className="calc-card">
          <label className="calc-label">Select Product</label>
          <select className="calc-select" value={selectedProduct.name} onChange={e => {
            const p = PRODUCTS.find(x => x.name === e.target.value);
            setSelectedProduct(p); setResult(null);
          }}>
            {PRODUCTS.map(p => <option key={p.name}>{p.name}</option>)}
          </select>

          {!isSheet && (
            <div className="calc-row">
              <div className="calc-group">
                <label className="calc-label">{selectedProduct.formula === 'flat_bar' ? 'Width (mm)' : 'Size / Dia (mm)'}</label>
                <input className="calc-input" type="number" placeholder="e.g. 50" value={dim1} onChange={e => setDim1(e.target.value)} />
              </div>
              {needsThickness && (
                <div className="calc-group">
                  <label className="calc-label">Thickness (mm)</label>
                  <input className="calc-input" type="number" placeholder="e.g. 2.5" value={thickness} onChange={e => setThickness(e.target.value)} />
                </div>
              )}
            </div>
          )}

          <div className="calc-row">
            <div className="calc-group">
              <label className="calc-label">{isSheet ? 'Area (sqft)' : 'Length (metres)'}</label>
              <input className="calc-input" type="number" placeholder={isSheet ? "e.g. 100" : "e.g. 6"} value={length} onChange={e => setLength(e.target.value)} />
            </div>
            <div className="calc-group">
              <label className="calc-label">Quantity (pcs)</label>
              <input className="calc-input" type="number" placeholder="1" value={qty} onChange={e => setQty(e.target.value)} />
            </div>
          </div>

          <div className="calc-info">
            <span>📌 Rate used: <strong>₹{selectedProduct.ratePerKg}/{isSheet ? 'sqft' : 'kg'}</strong> (market estimate)</span>
          </div>

          <button className="calc-btn" onClick={handleCalc}>Calculate →</button>
        </div>

        {result && (
          <div className="calc-result-card">
            <h3>Results</h3>
            <div className="calc-results-grid">
              {!isSheet && (
                <div className="calc-result-item">
                  <span className="result-label">Total Weight</span>
                  <span className="result-value">{result.weight.toFixed(2)} <small>kg</small></span>
                </div>
              )}
              <div className="calc-result-item highlight">
                <span className="result-label">Estimated Cost</span>
                <span className="result-value">₹{Math.round(result.cost).toLocaleString('en-IN')}</span>
              </div>
              <div className="calc-result-item">
                <span className="result-label">Product</span>
                <span className="result-value small">{selectedProduct.name}</span>
              </div>
              <div className="calc-result-item">
                <span className="result-label">Qty</span>
                <span className="result-value">{qty} pcs</span>
              </div>
            </div>
            <p className="calc-disclaimer">* This is an estimate. Final price may vary. Contact us for exact quote.</p>
            <button className="calc-wa-btn" onClick={handleWhatsAppQuote}>
              💬 Send to WhatsApp for Exact Quote
            </button>
          </div>
        )}
      </div>

      {/* Reference Table */}
      <div className="calc-ref-table">
        <h3>📋 Common Steel Sizes & Reference Weights</h3>
        <table>
          <thead><tr><th>Product</th><th>Size</th><th>Weight/mtr</th><th>Est. Rate</th></tr></thead>
          <tbody>
            {[
              ['MS Square Pipe', '25x25x2mm', '1.43 kg', '₹68/kg'],
              ['MS Square Pipe', '50x50x3mm', '4.35 kg', '₹68/kg'],
              ['TMT Rod', '8mm dia', '0.39 kg', '₹62/kg'],
              ['TMT Rod', '12mm dia', '0.89 kg', '₹62/kg'],
              ['MS Angle', '50x50x5mm', '3.77 kg', '₹67/kg'],
              ['GI Pipe', '1 inch / 2mm', '1.87 kg', '₹105/kg'],
              ['MS Flat Bar', '50x6mm', '2.36 kg', '₹66/kg'],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => <td key={j}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calculator;
