import React, { useState } from 'react';
import { FaPlus, FaSearch, FaEye, FaTrash } from 'react-icons/fa';
import { useRole } from '../../context/RoleContext';
import './Projects.css';

const initialOrders = [
  { id: 'ORD-001', customer: 'Rajesh Construction', phone: '9876543210', items: '20x MS Square Pipe 1x1, 10x TMT Bar 12mm', total: 30500, date: '22 Sep 2026', status: 'Delivered', payment: 'Paid' },
  { id: 'ORD-002', customer: 'Chennai Builders', phone: '8765432109', items: '50x Color Coated Roofing Sheet, 5x MS Angle 50x50x5', total: 11250, date: '21 Sep 2026', status: 'In Transit', payment: 'Partial' },
  { id: 'ORD-003', customer: 'Malik & Sons', phone: '7654321098', items: '100x TMT Bar 8mm, 30x Binding Wire', total: 32100, date: '20 Sep 2026', status: 'Processing', payment: 'Unpaid' },
  { id: 'ORD-004', customer: 'S.K. Fabricators', phone: '9543216789', items: '15x GI Round Pipe 2 inch, 10x MS Flat 50x6', total: 35000, date: '19 Sep 2026', status: 'Delivered', payment: 'Paid' },
  { id: 'ORD-005', customer: 'Fathima Hardware', phone: '8432156789', items: '25x MS Rectangular Pipe 2x1', total: 37500, date: '18 Sep 2026', status: 'Delivered', payment: 'Paid' },
];

const Orders = () => {
  const { isManager } = useRole();
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [newOrder, setNewOrder] = useState({ customer: '', phone: '', items: '', total: '' });

  const filtered = orders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const deleteOrder = (e, id) => {
    e.stopPropagation();
    setOrders(orders.filter(o => o.id !== id));
  };

  const addOrder = () => {
    if (!newOrder.customer || !newOrder.items) return;
    const order = {
      id: 'ORD-' + String(orders.length + 1).padStart(3, '0'),
      ...newOrder,
      total: parseFloat(newOrder.total) || 0,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Processing',
      payment: 'Unpaid'
    };
    setOrders([order, ...orders]);
    setNewOrder({ customer: '', phone: '', items: '', total: '' });
    setShowNewOrder(false);
  };

  const statusColors = {
    'Delivered': 'delivered',
    'In Transit': 'transit',
    'Processing': 'processing'
  };

  const paymentColors = {
    'Paid': 'paid',
    'Partial': 'partial',
    'Unpaid': 'unpaid'
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1>Customer Orders</h1>
          <p>Track and manage all customer orders and deliveries.</p>
        </div>
        <button className="primary-btn" onClick={() => setShowNewOrder(!showNewOrder)}>
          <FaPlus /> New Order
        </button>
      </div>

      {showNewOrder && (
        <div className="new-order-card">
          <h3>Create New Order</h3>
          <div className="order-form">
            <input placeholder="Customer Name" value={newOrder.customer} onChange={e => setNewOrder({...newOrder, customer: e.target.value})} />
            <input placeholder="Phone Number" value={newOrder.phone} onChange={e => setNewOrder({...newOrder, phone: e.target.value})} />
            <input placeholder="Items (e.g. 20x TMT Bar 12mm)" value={newOrder.items} onChange={e => setNewOrder({...newOrder, items: e.target.value})} />
            <input placeholder="Total Amount (Rs.)" type="number" value={newOrder.total} onChange={e => setNewOrder({...newOrder, total: e.target.value})} />
            <button className="primary-btn" onClick={addOrder}>Create Order</button>
          </div>
        </div>
      )}

      <div className="orders-filters">
        <div className="orders-search">
          <FaSearch />
          <input placeholder="Search by customer or order ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="status-tabs">
          {['All', 'Processing', 'In Transit', 'Delivered'].map(s => (
            <button key={s} className={`tab-btn ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className="orders-table">
        <div className="ot-header">
          <span>Order ID</span>
          <span>Customer</span>
          <span>Items</span>
          <span>Total</span>
          <span>Date</span>
          <span>Status</span>
          <span>Payment</span>
          <span>Action</span>
        </div>
        {filtered.map(o => (
          <div className="ot-row" key={o.id} onClick={() => setSelectedOrder(o)}>
            <span className="order-id">{o.id}</span>
            <span className="order-customer">{o.customer}</span>
            <span className="order-items">{o.items.length > 40 ? o.items.substring(0, 40) + '...' : o.items}</span>
            <span className="order-total">Rs.{o.total.toLocaleString()}</span>
            <span className="order-date">{o.date}</span>
            <span className={`order-badge ${statusColors[o.status]}`}>{o.status}</span>
            <span className={`order-badge ${paymentColors[o.payment]}`}>{o.payment}</span>
            <span className="order-actions">{isManager && <button onClick={(e) => deleteOrder(e, o.id)} style={{background:"none", border:"none", color:"#ef4444", cursor:"pointer", padding:"4px"}}><FaTrash/></button>}</span>
          </div>
        ))}
        {filtered.length === 0 && <div className="empty-text">No orders found.</div>}
      </div>

      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal" onClick={e => e.stopPropagation()}>
            <h3>Order Details — {selectedOrder.id}</h3>
            <div className="modal-details">
              <div className="detail-row"><strong>Customer:</strong> {selectedOrder.customer}</div>
              <div className="detail-row"><strong>Phone:</strong> {selectedOrder.phone}</div>
              <div className="detail-row"><strong>Items:</strong> {selectedOrder.items}</div>
              <div className="detail-row"><strong>Total:</strong> Rs.{selectedOrder.total.toLocaleString()}</div>
              <div className="detail-row"><strong>Date:</strong> {selectedOrder.date}</div>
              <div className="detail-row"><strong>Status:</strong> <span className={`order-badge ${statusColors[selectedOrder.status]}`}>{selectedOrder.status}</span></div>
              <div className="detail-row"><strong>Payment:</strong> <span className={`order-badge ${paymentColors[selectedOrder.payment]}`}>{selectedOrder.payment}</span></div>
            </div>
            <button className="secondary-btn" onClick={() => setSelectedOrder(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;


