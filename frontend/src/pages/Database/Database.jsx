import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaBoxOpen, FaDownload, FaSync, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useRole } from '../../context/RoleContext';
import './Database.css';

const API_BASE = 'https://qadri-steel-and-tubes.onrender.com';

const Database = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const { isManager } = useRole();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', category: '', brand: '', price: '', stock_status: 'In Stock',
    image: '', rating: 5.0, reviews: 0, desc: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) setProducts(data);
        if (data.length > 0 && !selectedProduct) setSelectedProduct(data[0]);
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

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert("Name, Category, and Price are required.");
      return;
    }
    
    setSaving(true);
    try {
      const url = editingProduct 
        ? `${API_BASE}/products/${editingProduct.id}`
        : `${API_BASE}/products`;
        
      const method = editingProduct ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        rating: parseFloat(formData.rating) || 5.0,
        reviews: parseInt(formData.reviews) || 0
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setShowAddModal(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        alert("Failed to save product");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedProduct?.id === id) setSelectedProduct(null);
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name || '', category: p.category || '', brand: p.brand || '',
      price: p.price || '', stock_status: p.stock_status || 'In Stock',
      image: p.image || '', rating: p.rating || 5.0, reviews: p.reviews || 0, desc: p.desc || ''
    });
    setShowAddModal(true);
  };
  
  const openAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '', category: '', brand: '', price: '', stock_status: 'In Stock',
      image: '', rating: 5.0, reviews: 0, desc: ''
    });
    setShowAddModal(true);
  };

  return (
    <div className="database-container">
      <div className="database-header">
        <div>
          <h1>Product Catalog</h1>
          <p>Browse our complete inventory of steel and building materials.</p>
        </div>
        <div className="db-actions">
          <button className="db-action-btn secondary" onClick={fetchProducts}>
            <FaSync /> Refresh
          </button>
          {isManager && (
            <button className="db-action-btn primary" onClick={openAdd}>
              <FaPlus /> Add Product
            </button>
          )}
        </div>
      </div>

      <div className="db-toolbar">
        <div className="db-search">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search catalog by name, brand, or code..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="db-filters">
          <FaFilter className="filter-icon" />
          <div className="category-tabs">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="db-layout">
        <div className="db-list-pane">
          {loading ? (
            <div className="db-loading">
              <div className="spinner"></div>
              <p>Loading catalog...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="db-empty">
              <FaBoxOpen className="empty-icon" />
              <h3>No products found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="product-list">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className={`product-list-item ${selectedProduct?.id === product.id ? 'active' : ''}`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="pli-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} onError={(e) => {e.target.src='/placeholder.png'}}/>
                    ) : (
                      <div className="pli-img-placeholder">QS</div>
                    )}
                  </div>
                  <div className="pli-content">
                    <div className="pli-brand">{product.brand || 'Qadri Steel'}</div>
                    <div className="pli-name">{product.name}</div>
                    <div className="pli-meta">
                      <span className="pli-price">₹{product.price}</span>
                      <span className={`stock-badge ${product.stock_status === 'In Stock' ? 'in-stock' : 'low-stock'}`}>
                        {product.stock_status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="db-detail-pane">
          {selectedProduct ? (
            <div className="product-detail">
              <div className="pd-header">
                <span className="pd-category">{selectedProduct.category}</span>
                <span className={`stock-badge ${selectedProduct.stock_status === 'In Stock' ? 'in-stock' : 'low-stock'}`}>
                  {selectedProduct.stock_status}
                </span>
                
                {isManager && (
                  <div style={{marginLeft: 'auto', display: 'flex', gap: '8px'}}>
                    <button className="manager-edit-btn" onClick={() => openEdit(selectedProduct)}><FaEdit /> Edit</button>
                    <button className="manager-del-btn" onClick={() => handleDelete(selectedProduct.id)}><FaTrash /></button>
                  </div>
                )}
              </div>
              
              <div className="pd-image-large">
                 {selectedProduct.image ? (
                    <img src={selectedProduct.image} alt={selectedProduct.name} onError={(e) => {e.target.src='/placeholder.png'}} />
                 ) : (
                    <div className="pd-img-placeholder">Qadri Steel</div>
                 )}
              </div>

              <h2 className="pd-title">{selectedProduct.name}</h2>
              <div className="pd-brand">{selectedProduct.brand || 'Qadri Steel & Tubes'}</div>
              
              <div className="pd-price-row">
                <div className="pd-price">₹{selectedProduct.price}</div>
                <div className="pd-unit">per unit/kg</div>
              </div>

              <div className="pd-section">
                <h3>Description</h3>
                <p className="pd-desc">{selectedProduct.desc || "High-quality structural steel product manufactured to industrial standards."}</p>
              </div>

              <div className="pd-section">
                <h3>Specifications</h3>
                <table className="specs-table">
                  <tbody>
                    <tr><td>Item ID</td><td>{selectedProduct.id}</td></tr>
                    <tr><td>Brand</td><td>{selectedProduct.brand || 'Generic'}</td></tr>
                    <tr><td>Category</td><td>{selectedProduct.category}</td></tr>
                    <tr><td>Rating</td><td>⭐ {selectedProduct.rating} ({selectedProduct.reviews} reviews)</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="pd-actions">
                <button className="quote-btn">Request Quote</button>
              </div>
            </div>
          ) : (
            <div className="db-empty" style={{height: '100%', justifyContent: 'center'}}>
              <FaBoxOpen className="empty-icon" />
              <h3>Select a product</h3>
              <p>Click on an item from the list to view details.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* ADD/EDIT MODAL (MANAGER ONLY) */}
      {showAddModal && isManager && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '600px', width: '90%'}}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <div className="add-form-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px'}}>
              <div className="form-group">
                <label>Product Name*</label>
                <input className="sr-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Category*</label>
                <input className="sr-input" placeholder="e.g. MS Pipe" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input className="sr-input" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Price (₹)*</label>
                <input className="sr-input" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Stock Status</label>
                <select className="sr-input" value={formData.stock_status} onChange={e => setFormData({...formData, stock_status: e.target.value})}>
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input className="sr-input" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
              </div>
              <div className="form-group" style={{gridColumn: '1 / -1'}}>
                <label>Description</label>
                <textarea className="sr-input" rows="3" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})}></textarea>
              </div>
            </div>
            <div style={{display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end'}}>
              <button className="sr-btn sr-btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="sr-btn sr-btn-add" disabled={saving} onClick={handleSave}>{saving ? 'Saving...' : 'Save Product'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Database;
