import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaPrint, FaDownload, FaFileInvoiceDollar } from 'react-icons/fa';
import './Designer.css';

const Quotations = () => {
  const [products, setProducts] = useState([]);
  const [quoteItems, setQuoteItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [savedQuotes, setSavedQuotes] = useState([]);

  useEffect(() => {
    fetch('https://qadri-steel-and-tubes.onrender.com/products')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setProducts(data); })
      .catch(() => {});

    const saved = JSON.parse(localStorage.getItem('qadri_quotes') || '[]');
    setSavedQuotes(saved);
  }, []);

  const addItem = () => {
    if (!selectedProduct) return;
    const prod = products.find(p => p.id === selectedProduct);
    if (!prod) return;

    const existing = quoteItems.find(q => q.id === prod.id);
    if (existing) {
      setQuoteItems(quoteItems.map(q =>
        q.id === prod.id ? { ...q, qty: q.qty + quantity } : q
      ));
    } else {
      setQuoteItems([...quoteItems, {
        id: prod.id,
        name: prod.name,
        brand: prod.brand,
        price: prod.price,
        qty: quantity,
      }]);
    }
    setSelectedProduct('');
    setQuantity(1);
  };

  const removeItem = (id) => {
    setQuoteItems(quoteItems.filter(q => q.id !== id));
  };

  const total = quoteItems.reduce((s, i) => s + (i.price * i.qty), 0);

  const saveQuote = () => {
    if (!customerName || quoteItems.length === 0) return;
    const quote = {
      id: 'Q-' + Date.now(),
      customer: customerName,
      phone: customerPhone,
      items: quoteItems,
      total,
      date: new Date().toLocaleDateString('en-IN'),
      status: 'Pending'
    };
    const updated = [quote, ...savedQuotes];
    setSavedQuotes(updated);
    localStorage.setItem('qadri_quotes', JSON.stringify(updated));
    setQuoteItems([]);
    setCustomerName('');
    setCustomerPhone('');
  };

  const deleteSavedQuote = (id) => {
    const updated = savedQuotes.filter(q => q.id !== id);
    setSavedQuotes(updated);
    localStorage.setItem('qadri_quotes', JSON.stringify(updated));
  };

  const printQuote = () => {
    const printWindow = window.open('', '_blank');
    const html = `
      <html><head><title>Quotation - Qadri Steel & Tubes</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
        h1 { color: #1e3a5f; margin-bottom: 5px; }
        .subtitle { color: #666; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #1e3a5f; color: white; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
        .total-row td { font-weight: bold; font-size: 16px; border-top: 2px solid #1e3a5f; }
        .footer { margin-top: 40px; font-size: 12px; color: #999; }
      </style></head><body>
      <h1>Qadri Steel & Tubes</h1>
      <p class="subtitle">Old No. 34, New No. 67, Post Office Street, Chennai - 600 001 | Ph: 9384902028</p>
      <hr/>
      <p><strong>Customer:</strong> ${customerName} ${customerPhone ? '| Ph: ' + customerPhone : ''}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
      <table>
        <thead><tr><th>#</th><th>Product</th><th>Brand</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead>
        <tbody>
          ${quoteItems.map((item, i) => `<tr><td>${i+1}</td><td>${item.name}</td><td>${item.brand}</td><td>${item.qty}</td><td>Rs.${item.price}</td><td>Rs.${(item.price * item.qty).toFixed(2)}</td></tr>`).join('')}
          <tr class="total-row"><td colspan="5">TOTAL</td><td>Rs.${total.toFixed(2)}</td></tr>
        </tbody>
      </table>
      <p class="footer">This is a computer-generated quotation from Qadri Steel & Tubes. Prices are subject to change.</p>
      <script>window.print(); window.close();</script>
      </body></html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="quotes-page">
      <div className="quotes-header">
        <div>
          <h1>Quotations</h1>
          <p>Create professional quotations for your customers.</p>
        </div>
      </div>

      <div className="quotes-layout">
        <div className="quote-builder">
          <div className="builder-card">
            <h3><FaFileInvoiceDollar /> New Quote</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Customer Name</label>
                <input type="text" placeholder="Enter customer name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" placeholder="Enter phone number" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
              </div>
            </div>

            <div className="form-row align-bottom">
              <div className="form-group flex-2">
                <label>Select Product</label>
                <select className="clean-select" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                  <option value="">-- Choose a product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {p.brand} (Rs.{p.price})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} />
              </div>
              <div className="form-group action-group">
                <button className="primary-btn add-item-btn" onClick={addItem}><FaPlus /> Add</button>
              </div>
            </div>

            {quoteItems.length > 0 && (
              <div className="quote-table">
                <div className="qt-header">
                  <span>Product</span>
                  <span>Brand</span>
                  <span>Price</span>
                  <span>Qty</span>
                  <span>Amount</span>
                  <span></span>
                </div>
                {quoteItems.map(item => (
                  <div className="qt-row" key={item.id}>
                    <span className="qt-name">{item.name}</span>
                    <span>{item.brand}</span>
                    <span>Rs.{item.price}</span>
                    <span>{item.qty}</span>
                    <span className="qt-amount">Rs.{(item.price * item.qty).toFixed(2)}</span>
                    <span><button className="delete-btn" onClick={() => removeItem(item.id)}><FaTrash /></button></span>
                  </div>
                ))}
                <div className="qt-total">
                  <span>Total</span>
                  <span className="qt-total-amount">Rs.{total.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="quote-actions">
              <button className="primary-btn" onClick={saveQuote} disabled={!customerName || quoteItems.length === 0}>
                <FaDownload /> Save Quote
              </button>
              <button className="secondary-btn" onClick={printQuote} disabled={quoteItems.length === 0}>
                <FaPrint /> Print Quote / PDF
              </button>
            </div>
          </div>
        </div>

        <div className="saved-quotes">
          <div className="builder-card">
            <h3>Saved Quotes ({savedQuotes.length})</h3>
            {savedQuotes.length === 0 ? (
              <p className="empty-text">No saved quotes yet. Create your first quote!</p>
            ) : (
              <div className="saved-list">
                {savedQuotes.map(q => (
                  <div className="saved-item" key={q.id}>
                    <div className="saved-top">
                      <strong>{q.customer}</strong>
                      <span className="saved-date">{q.date}</span>
                    </div>
                    <div className="saved-details">
                      <span>{q.items.length} items</span>
                      <span className="saved-total">Rs.{q.total.toLocaleString()}</span>
                    </div>
                    <div className="saved-bot">
                        <span className={`quote-status ${q.status.toLowerCase()}`}>{q.status}</span>
                        <button className="delete-btn small" onClick={() => deleteSavedQuote(q.id)}><FaTrash/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotations;
