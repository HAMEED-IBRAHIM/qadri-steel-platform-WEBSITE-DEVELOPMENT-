import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBoxes,
  FaFileInvoiceDollar,
  FaTruck,
  FaRupeeSign,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';
import './Dashboard.css';

const StatCard = ({ title, value, icon, trend, positive, prefix }) => (
  <div className="stat-card">
    <div className="stat-icon-wrap">{icon}</div>
    <div className="stat-info">
      <span className="stat-label">{title}</span>
      <h3 className="stat-value">{prefix}{value}</h3>
      <span className={`stat-trend ${positive ? 'positive' : 'negative'}`}>
        {positive ? <FaArrowUp /> : <FaArrowDown />} {trend}
      </span>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      try { setUser(JSON.parse(cachedUser)); } catch(e) {}
    }
    fetch('https://qadri-steel-and-tubes.onrender.com/products')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setProducts(data); })
      .catch(() => {});
  }, []);

  const inStock = products.filter(p => p.stock_status === 'In Stock').length;
  const lowStock = products.filter(p => p.stock_status === 'Low Stock').length;
  const categories = [...new Set(products.map(p => p.category))];

  return (
        <div className="dashboard-page">
      <div className="dashboard-animated-bg">
        <img src="/pipes-hand.png" className="steel-anim-img anim-1" alt="" />
        <img src="/roofing-sheet.png" className="steel-anim-img anim-2" alt="" />
        <img src="/truck-pipes.jpg" className="steel-anim-img anim-3" alt="" />
        <img src="/poster.jpg" className="steel-anim-img anim-4" alt="" />
        <img src="/pipes-hand.png" className="steel-anim-img anim-5" alt="" />
      </div>

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="banner-text">
          <h1>Welcome back{user ? `, ${user.name}` : ''}!</h1>
          <p>Here's your business overview for today.</p>
        </div>
        <div className="banner-actions">
          <button className="primary-btn" onClick={() => navigate('/catalog')}>
            <FaBoxes /> View Catalog
          </button>
          <button className="secondary-btn" onClick={() => navigate('/quotes')}>
            <FaFileInvoiceDollar /> New Quote
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <StatCard
          title="Total Products"
          value={products.length}
          icon={<FaBoxes />}
          trend={`${categories.length} categories`}
          positive={true}
        />
        <StatCard
          title="In Stock"
          value={inStock}
          icon={<FaTruck />}
          trend="Ready to ship"
          positive={true}
        />
        <StatCard
          title="Low Stock"
          value={lowStock}
          icon={<FaBoxes />}
          trend="Needs reorder"
          positive={false}
        />
        <StatCard
          title="Avg. Price"
          value={products.length > 0 ? Math.round(products.reduce((s,p) => s + (p.price || 0), 0) / products.length) : 0}
          icon={<FaRupeeSign />}
          trend="Per unit"
          positive={true}
          prefix="₹"
        />
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">

        {/* Recent Products */}
        <div className="dash-card">
          <div className="card-top">
            <h3>Product Inventory</h3>
            <button className="text-btn" onClick={() => navigate('/catalog')}>View All</button>
          </div>
          <div className="product-table">
            <div className="table-header">
              <span>Product</span>
              <span>Brand</span>
              <span>Price</span>
              <span>Status</span>
            </div>
            {products.slice(0, 6).map(p => (
              <div className="table-row" key={p.id}>
                <span className="product-name">{p.name}</span>
                <span className="product-brand">{p.brand}</span>
                <span className="product-price">₹{p.price}</span>
                <span className={`stock-badge ${p.stock_status === 'In Stock' ? 'in-stock' : 'low-stock'}`}>
                  {p.stock_status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Business Info */}
        <div className="dash-card business-card">
          <div className="card-top">
            <h3>Business Info</h3>
          </div>
          <div className="business-info">
            <div className="info-row">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <strong>Address</strong>
                <p>Old No. 34, New No. 67, Post Office Street, Mannady, Chennai - 600 001</p>
              </div>
            </div>
            <div className="info-row">
              <FaPhone className="info-icon" />
              <div>
                <strong>Phone</strong>
                <p>9384902028 | 86103 88075</p>
              </div>
            </div>
            <div className="info-row">
              <FaEnvelope className="info-icon" />
              <div>
                <strong>Email</strong>
                <p>qadristeeltubes@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="category-chips">
            <h4>Product Categories</h4>
            <div className="chips-wrap">
              {categories.map(cat => (
                <span className="chip" key={cat}>{cat}</span>
              ))}
            </div>
          </div>

          <div className="quick-actions">
            <h4>Quick Actions</h4>
            <button className="primary-btn full-w" onClick={() => navigate('/quotes')}>
              <FaPlus /> Create New Quote
            </button>
            <button className="secondary-btn full-w" onClick={() => navigate('/orders')}>
              View Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
