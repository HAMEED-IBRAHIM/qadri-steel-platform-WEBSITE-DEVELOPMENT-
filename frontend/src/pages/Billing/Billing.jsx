import React, { useState, useRef } from 'react';
import { FaPlus, FaTrash, FaPrint } from 'react-icons/fa';
import './Billing.css';

const emptyRow = () => ({ qty: '', particulars: '', hsnCode: '7306', rate: '', amount: '' });

// Extract weight from particulars like "60x40x2mm (370kg)" → 370
const extractWeight = (particulars) => {
  const match = particulars.match(/\((\d+(?:\.\d+)?)\s*kg\)/i);
  return match ? parseFloat(match[1]) : null;
};

const calcAmount = (row) => {
  const weight = extractWeight(row.particulars);
  const rate = parseFloat(row.rate) || 0;
  if (weight && rate) return parseFloat((weight * rate).toFixed(2));
  const qty = parseFloat(row.qty) || 0;
  if (qty && rate) return parseFloat((qty * rate).toFixed(2));
  return '';
};

const Billing = () => {
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [party, setParty] = useState('');
  const [partyAddress, setPartyAddress] = useState('');
  const [partyGstin, setPartyGstin] = useState('');
  const [partyCellNo, setPartyCellNo] = useState('');
  const [rows, setRows] = useState([
    emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow(),
  ]);
  const [labour, setLabour] = useState('');
  const [lorryNo, setLorryNo] = useState('');

  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    const computed = calcAmount(updated[index]);
    updated[index].amount = computed !== '' ? computed : '';
    setRows(updated);
  };

  const addRow = () => setRows([...rows, emptyRow()]);
  const removeRow = (i) => { if (rows.length > 1) setRows(rows.filter((_, idx) => idx !== i)); };

  const rowTotal = rows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
  const labourAmt = parseFloat(labour) || 0;
  const subtotal = rowTotal + labourAmt;
  const cgst = subtotal > 0 ? parseFloat((subtotal * 0.09).toFixed(2)) : 0;
  const sgst = cgst;
  const grandTotal = subtotal > 0 ? parseFloat((subtotal + cgst + sgst).toFixed(2)) : 0;

  return (
    <div className="billing-wrapper">

      {/* Toolbar - hidden on print */}
      <div className="billing-toolbar no-print">
        <div className="tb-left">
          <h2>🧾 GST Invoice</h2>
          <span className="tb-hint">Fill in the details below. Amount is auto-calculated.</span>
        </div>
        <div className="tb-right">
          <button className="tb-btn" onClick={addRow}><FaPlus /> Add Row</button>
          <button className="tb-btn primary" onClick={() => window.print()}><FaPrint /> Print / Save PDF</button>
        </div>
      </div>

      {/* ===== INVOICE PAPER ===== */}
      <div className="invoice-paper">

        {/* TOP LINE */}
        <div className="inv-topline">
          <div className="inv-gstin-top">
            GSTIN : <strong>33AABFQ0325R1Z7</strong>
          </div>
          <div className="inv-gst-label">GST INVOICE</div>
          <div className="inv-phone-top">
            <div>Phone : 044 - 4226 5636</div>
            <div>HAMEED &nbsp;&nbsp; 90773 01497</div>
            <div>MOHIDEEN 97911 46558</div>
          </div>
        </div>

        {/* LOGO + COMPANY NAME */}
        <div className="inv-company-block">
          <div className="inv-qst-logo">
            <div className="qst-octagon">
              <span className="qst-text">QST</span>
            </div>
          </div>
          <div className="inv-company-info">
            <div className="inv-tamil-name">காத்ரி ஸ்டீல் &amp; டியூப்ஸ</div>
            <div className="inv-eng-name">QADRI STEEL &amp; TUBES</div>
            <div className="inv-sub">Dealers in &nbsp; M.S. ROD, TMT ROD &amp; STEEL TUBES</div>
            <div className="inv-addr">Old No. 34, New No. 67, POST OFFICE STREET, MANNADY, CHENNAI - 600 001</div>
          </div>
        </div>

        <div className="inv-divider"></div>

        {/* BILL META ROW */}
        <div className="inv-meta-row">
          <div className="meta-left">
            <span className="meta-key">No.</span>
            <input className="meta-val underline short" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} placeholder="307" />
          </div>
          <div className="meta-right">
            <span className="meta-key">Date</span>
            <input className="meta-val underline" type="text" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} placeholder="11/03/2026" />
          </div>
        </div>

        {/* PARTY NAME */}
        <div className="inv-party-row">
          <span className="meta-key">M/s.</span>
          <input className="meta-val underline party-name" value={party} onChange={e => setParty(e.target.value)} placeholder="SRI Vaishnavi Graphics Pvt. Ltd" />
        </div>

        {/* PARTY ADDRESS */}
        <div className="inv-party-row">
          <span className="meta-key">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <input className="meta-val underline party-addr" value={partyAddress} onChange={e => setPartyAddress(e.target.value)} placeholder="No.40, Vyasarpadi Industrial Estate, Erukancherry High Road, Chennai-600 039" />
        </div>

        {/* PARTY GSTIN + CELL */}
        <div className="inv-gstin-row">
          <div className="gstin-left">
            <span className="meta-key">Party's GSTIN</span>
            <input className="gstin-input" value={partyGstin} onChange={e => setPartyGstin(e.target.value.toUpperCase())} placeholder="33AA0C50329P1ZY" />
          </div>
          <div className="gstin-right">
            <span className="meta-key">Cell No:</span>
            <input className="meta-val underline" value={partyCellNo} onChange={e => setPartyCellNo(e.target.value)} placeholder="93810 - 83268" />
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <table className="inv-table">
          <thead>
            <tr>
              <th className="th-qty">Qnty.</th>
              <th className="th-particulars">PARTICULARS</th>
              <th className="th-hsn">HSN<br/>CODE</th>
              <th className="th-rate">Rate</th>
              <th className="th-amount">Amount<br/>Rs. &nbsp; P.</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="inv-tr">
                <td className="td-qty">
                  <input className="td-input center" value={row.qty} onChange={e => updateRow(i, 'qty', e.target.value)} placeholder="2Nos" />
                </td>
                <td className="td-particulars">
                  <input className="td-input" value={row.particulars} onChange={e => updateRow(i, 'particulars', e.target.value)} placeholder="60 X 40 X 2mm (370kg)" />
                </td>
                <td className="td-hsn">
                  <input className="td-input center" value={row.hsnCode} onChange={e => updateRow(i, 'hsnCode', e.target.value)} placeholder="7306" />
                </td>
                <td className="td-rate">
                  <input className="td-input center" type="number" value={row.rate} onChange={e => updateRow(i, 'rate', e.target.value)} placeholder="58" />
                </td>
                <td className="td-amount">
                  <div className="amount-wrap">
                    <span>{row.amount !== '' ? Number(row.amount).toLocaleString('en-IN') : ''}</span>
                    <button className="del-row no-print" onClick={() => removeRow(i)}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Labour row */}
            <tr className="inv-tr">
              <td className="td-qty"></td>
              <td className="td-particulars">
                <input
                  className="td-input italic"
                  value={labour ? `Labour` : ''}
                  readOnly
                  placeholder="Labour (fill amount →)"
                  style={{ color: '#555', cursor: 'default' }}
                />
              </td>
              <td className="td-hsn"></td>
              <td className="td-rate"></td>
              <td className="td-amount">
                <div className="amount-wrap">
                  <input
                    className="td-input center"
                    type="number"
                    value={labour}
                    onChange={e => setLabour(e.target.value)}
                    placeholder="400"
                  />
                </div>
              </td>
            </tr>

            {/* Subtotal row */}
            <tr className="subtotal-tr">
              <td colSpan={4} className="subtotal-label">Amount in Rs. =</td>
              <td className="subtotal-val">
                {subtotal > 0 ? subtotal.toLocaleString('en-IN') : ''}
              </td>
            </tr>
          </tbody>
        </table>

        {/* GST + GRAND TOTAL */}
        <div className="inv-gst-section">
          <div className="gst-left-spacer"></div>
          <div className="gst-box">
            <div className="gst-row">
              <span className="gst-key">CGST 9 %</span>
              <span className="gst-val">{cgst > 0 ? cgst.toLocaleString('en-IN') : ''}</span>
            </div>
            <div className="gst-row">
              <span className="gst-key">SGST 9 %</span>
              <span className="gst-val">{sgst > 0 ? sgst.toLocaleString('en-IN') : ''}</span>
            </div>
            <div className="gst-row">
              <span className="gst-key">IGST &nbsp; %</span>
              <span className="gst-val"></span>
            </div>
            <div className="gst-row grand-row">
              <span className="gst-key grand-key">GRAND TOTAL</span>
              <span className="gst-val grand-val">{grandTotal > 0 ? grandTotal.toLocaleString('en-IN') : ''}</span>
            </div>
          </div>
        </div>

        {/* FOR QADRI SIGNATURE */}
        <div className="inv-sig-block">
          <div className="sig-right">
            <div className="sig-title">For QADRI STEEL &amp; TUBES</div>
            <div className="sig-space"></div>
            <div className="sig-line"></div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="inv-footer-block">
          <div className="footer-line">Goods once sold cannot be taken back or exchanged</div>
          <div className="footer-line">Subject to Chennai Jurisdiction</div>
          <div className="footer-buyer-row">
            <span className="footer-key">Buyer Signature &nbsp;&nbsp;&nbsp; Lorry No.</span>
            <input className="meta-val underline lorry-field no-print" value={lorryNo} onChange={e => setLorryNo(e.target.value)} placeholder="TN 04 BF 7950" />
            <span className="print-only">{lorryNo}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Billing;
