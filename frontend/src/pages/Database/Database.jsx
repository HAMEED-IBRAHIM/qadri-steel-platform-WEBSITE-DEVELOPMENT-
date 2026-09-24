import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaBoxOpen, FaDownload, FaSync } from 'react-icons/fa';
import './Database.css';

const Database = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://qadri-steel-and-tubes.onrender.com/products');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) setProducts(data);
        if (data.length > 0) setSelectedProduct(data[0]);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="database-container">
      <div className="database-header">
        <div>
          <h1>Product Catalog</h1>
          <p>Browse our complete inventory of steel and building materials.</p>
        </div>
        <div className="header-actions">
          <button className="secondary-btn" onClick={fetchProducts}><FaSync /> Refresh</button>
          <button className="primary-btn" onClick={() => window.print()}><FaDownload /> Export PDF</button>
        </div>
      </div>

      <div className="database-filters">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search products by name, brand, or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-tabs">
          <FaFilter className="filter-icon" />
          {categories.map(cat => (
            <button 
              key={cat}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="database-content">
        <div className="materials-list">
          {loading ? (
            <div className="loading-state">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">No products found matching your criteria.</div>
          ) : (
            filteredProducts.map(prod => (
              <div 
                key={prod.id} 
                className={`material-card ${selectedProduct?.id === prod.id ? 'selected-card' : ''}`}
                onClick={() => setSelectedProduct(prod)}
              >
                <div className="card-header">
                  <h3>{prod.name}</h3>
                  <span className={`status-badge ${prod.stock_status === 'In Stock' ? 'success' : 'warning'}`}>
                    {prod.stock_status}
                  </span>
                </div>
                <div className="card-body">
                  <p className="card-brand"><strong>Brand:</strong> {prod.brand}</p>
                  <p className="card-price"><strong>Price:</strong> ₹{prod.price}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="material-details-panel">
          {selectedProduct ? (
            <div className="details-content">
              <div className="details-header">
                <span className="detail-category">{selectedProduct.category}</span>
                <h2>{selectedProduct.name}</h2>
                <p className="detail-id">Product ID: {selectedProduct.id}</p>
              </div>

              <div className="details-section">
                <h3>Description</h3>
                <p>{selectedProduct.description}</p>
              </div>

              <div className="specifications-grid">
                <div className="spec-item">
                  <span className="spec-label">Brand</span>
                  <span className="spec-value">{selectedProduct.brand}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Price</span>
                  <span className="spec-value price">₹{selectedProduct.price}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Stock Status</span>
                  <span className={`spec-value status-badge ${selectedProduct.stock_status === 'In Stock' ? 'success' : 'warning'}`}>
                    {selectedProduct.stock_status}
                  </span>
                </div>
                <div className="spec-item full-width">
                  <span className="spec-label">Specifications</span>
                  <span className="spec-value">{selectedProduct.specifications}</span>
                </div>
              </div>

              <div className="details-actions">
                <button className="primary-btn"><FaBoxOpen /> Add to Quote</button>
              </div>
            </div>
          ) : (
            <div className="empty-selection">
              Select a product from the list to view its details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Database;
