import React, { useState, useRef } from 'react';
import { FaPlus, FaTrash, FaPrint, FaDownload, FaSave } from 'react-icons/fa';
import './Billing.css';

const SHOP_INFO = {
  gstin: '33AABFQ0325R1Z7',
  name: 'QADRI STEEL & TUBES',
  nameTamil: 'காத்ரி ஸ்டீல் & டியூப்ஸ',
  dealers: 'Dealers in : M.S. ROD, TMT ROD & STEEL TUBES',
  address: 'Old No. 34, New No. 67, POST OFFICE STREET, MANNADY, CHENNAI - 600 001',
  phone1: '044 - 4226 5636',
  hameed: '90773 01497',
  mohideen: '97911 46558',
};

const emptyRow = () => ({ qty: '', particulars: '', hsnCode: '7306', rate: '', weight: '', amount: 0 });

// Extract weight from particulars like "60x40x2mm (370kg)" → 370
const extractWeight = (particulars) => {
  const match = particulars.match(/\((\d+(?:\.\d+)?)\s*kg\)/i);
  return match ? parseFloat(match[1]) : null;
};

// Calculate row amount: if weight found in particulars → weight × rate, else qty × rate
const calcAmount = (row) => {
  const weight = extractWeight(row.particulars);
  const rate = parseFloat(row.rate) || 0;
  if (weight && rate) return parseFloat((weight * rate).toFixed(2));
  const qty = parseFloat(row.qty) || 0;
  return parseFloat((qty * rate).toFixed(2));
};

const Billing = () => {
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [party, setParty] = useState('');
  const [partyAddress, setPartyAddress] = useState('');
  const [partyGstin, setPartyGstin] = useState('');
  const [partyCellNo, setPartyCellNo] = useState('');
  const [rows, setRows] = useState([emptyRow(), emptyRow(), emptyRow()]);
  const [labour, setLabour] = useState('');
  const [igstEnabled, setIgstEnabled] = useState(false);
  const [buyerSignature, setBuyerSignature] = useState('');
  const [lorryNo, setLorryNo] = useState('');
  const [saved, setSaved] = useState(false);
  const printRef = useRef();

  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    updated[index].amount = calcAmount(updated[index]);
    setRows(updated);
  };

  const addRow = () => setRows([...rows, emptyRow()]);

  const removeRow = (index) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  const subtotal = rows.reduce((sum, r) => sum + (r.amount || 0), 0) + (parseFloat(labour) || 0);
  const cgst = parseFloat((subtotal * 0.09).toFixed(2));
  const sgst = parseFloat((subtotal * 0.09).toFixed(2));
  const igst = igstEnabled ? parseFloat((subtotal * 0.18).toFixed(2)) : 0;
  const grandTotal = parseFloat((subtotal + cgst + sgst + igst).toFixed(2));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="billing-wrapper">
      {/* Top toolbar - hidden on print */}
      <div className="billing-toolbar no-print">
        <h2>GST Invoice Generator</h2>
        <div className="toolbar-actions">
          <button className="tb-btn" onClick={addRow}><FaPlus /> Add Row</button>
          <button className="tb-btn primary" onClick={handlePrint}><FaPrint /> Print / Download</button>
        </div>
      </div>

      {/* Invoice */}
      <div className="invoice-container" ref={printRef} id="invoice-print">
        {/* HEADER */}
        <div className="inv-header">
          <div className="inv-header-top">
            <div className="inv-gstin-left">
              <span>GSTIN : {SHOP_INFO.gstin}</span>
              <div className="inv-label-small">GST INVOICE</div>
            </div>
            <div className="inv-phone-right">
              <div>Phone : {SHOP_INFO.phone1}</div>
              <div>HAMEED {SHOP_INFO.hameed}</div>
              <div>MOHIDEEN {SHOP_INFO.mohideen}</div>
            </div>
          </div>

          <div className="inv-logo-block">
            <div className="inv-logo-box">QST</div>
            <div className="inv-title-block">
              <div className="inv-tamil">{SHOP_INFO.nameTamil}</div>
              <div className="inv-name">{SHOP_INFO.name}</div>
              <div className="inv-dealers">{SHOP_INFO.dealers}</div>
              <div className="inv-address">{SHOP_INFO.address}</div>
            </div>
          </div>
        </div>

        {/* INVOICE META */}
        <div className="inv-meta">
          <div className="inv-meta-left">
            <div className="inv-meta-row">
              <span className="meta-label">No.</span>
              <input className="meta-input meta-short" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} placeholder="307" />
            </div>
            <div className="inv-meta-row">
              <span className="meta-label">M/s.</span>
              <input className="meta-input meta-long" value={party} onChange={e => setParty(e.target.value)} placeholder="Customer / Company Name" />
            </div>
            <div className="inv-meta-row">
              <span className="meta-label"></span>
              <input className="meta-input meta-long" value={partyAddress} onChange={e => setPartyAddress(e.target.value)} placeholder="Customer Address" />
            </div>
            <div className="inv-meta-row">
              <span className="meta-label">Party's GSTIN</span>
              <input className="meta-input meta-gstin" value={partyGstin} onChange={e => setPartyGstin(e.target.value.toUpperCase())} placeholder="33AA0C50329P1ZY" />
            </div>
          </div>
          <div className="inv-meta-right">
            <div className="inv-meta-row">
              <span className="meta-label">Date:</span>
              <input className="meta-input meta-short" type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
            </div>
            <div className="inv-meta-row">
              <span className="meta-label">Cell No:</span>
              <input className="meta-input meta-short" value={partyCellNo} onChange={e => setPartyCellNo(e.target.value)} placeholder="93810 - 83268" />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <table className="inv-table">
          <thead>
            <tr>
              <th className="col-qty">Qnty.</th>
              <th className="col-particulars">PARTICULARS</th>
              <th className="col-hsn">HSN CODE</th>
              <th className="col-rate">Rate</th>
              <th className="col-amount">Amount Rs. P.</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="inv-row">
                <td className="col-qty">
                  <input
                    className="cell-input center"
                    value={row.qty}
                    onChange={e => updateRow(i, 'qty', e.target.value)}
                    placeholder="2Nos"
                  />
                </td>
                <td className="col-particulars">
                  <input
                    className="cell-input"
                    value={row.particulars}
                    onChange={e => updateRow(i, 'particulars', e.target.value)}
                    placeholder="e.g. 60x40x2mm (370kg)"
                  />
                </td>
                <td className="col-hsn">
                  <input
                    className="cell-input center"
                    value={row.hsnCode}
                    onChange={e => updateRow(i, 'hsnCode', e.target.value)}
                    placeholder="7306"
                  />
                </td>
                <td className="col-rate">
                  <input
                    className="cell-input center"
                    type="number"
                    value={row.rate}
                    onChange={e => updateRow(i, 'rate', e.target.value)}
                    placeholder="58"
                  />
                </td>
                <td className="col-amount">
                  <div className="amount-cell">
                    <span className="amount-value">{row.amount > 0 ? row.amount.toLocaleString('en-IN') : ''}</span>
                    <button className="del-row no-print" onClick={() => removeRow(i)} title="Remove row"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Labour row */}
            <tr className="inv-row">
              <td className="col-qty"></td>
              <td className="col-particulars">
                <input
                  className="cell-input italic-placeholder"
                  value={labour !== '' ? `Labour : ₹${labour}` : ''}
                  onChange={e => {
                    const val = e.target.value.replace(/Labour\s*:\s*₹?/i, '').trim();
                    setLabour(val);
                  }}
                  placeholder="Labour (optional)"
                />
              </td>
              <td className="col-hsn"></td>
              <td className="col-rate"></td>
              <td className="col-amount">
                <span className="amount-value">{parseFloat(labour) > 0 ? parseFloat(labour).toLocaleString('en-IN') : ''}</span>
              </td>
            </tr>

            {/* Subtotal */}
            <tr className="subtotal-row">
              <td colSpan={4} className="subtotal-label">Amount in Rs.</td>
              <td className="col-amount subtotal-val">{subtotal > 0 ? subtotal.toLocaleString('en-IN') : ''}</td>
            </tr>
          </tbody>
        </table>

        {/* GST SECTION */}
        <div className="inv-gst">
          <div className="gst-spacer"></div>
          <div className="gst-table">
            <div className="gst-row">
              <span className="gst-label">CGST 9 %</span>
              <span className="gst-value">{subtotal > 0 ? cgst.toLocaleString('en-IN') : ''}</span>
            </div>
            <div className="gst-row">
              <span className="gst-label">SGST 9 %</span>
              <span className="gst-value">{subtotal > 0 ? sgst.toLocaleString('en-IN') : ''}</span>
            </div>
            <div className="gst-row igst-row">
              <span className="gst-label">
                IGST % 
                <input type="checkbox" className="no-print igst-toggle" checked={igstEnabled} onChange={e => setIgstEnabled(e.target.checked)} title="Enable IGST" />
              </span>
              <span className="gst-value">{igstEnabled && igst > 0 ? igst.toLocaleString('en-IN') : ''}</span>
            </div>
            <div className="gst-row grand-total-row">
              <span className="gst-label">GRAND TOTAL</span>
              <span className="gst-value grand-val">{grandTotal > 0 ? grandTotal.toLocaleString('en-IN') : ''}</span>
            </div>
          </div>
        </div>

        {/* SIGNATURE BLOCK */}
        <div className="inv-signature">
          <div className="sig-left">
            <div className="sig-text">For QADRI STEEL &amp; TUBES</div>
            <div className="sig-line"></div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="inv-footer">
          <div className="footer-text">Goods once sold cannot be taken back or exchanged</div>
          <div className="footer-text">Subject to Chennai Jurisdiction</div>
          <div className="footer-buyer">
            <span>Buyer Signature</span>
            <span>Lorry No.</span>
            <input className="meta-input lorry-input no-print" value={lorryNo} onChange={e => setLorryNo(e.target.value)} placeholder="TN 04 BF 7950" />
            <span className="print-only">{lorryNo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
