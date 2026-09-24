import React, { useState, useEffect } from 'react';
import './StockRegister.css';

const STORAGE_KEY = 'qst_stock_register';

const StockRegister = () => {
  const [rows, setRows] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRow, setNewRow] = useState({
    size: '',
    stock: '',
    sales: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

  const startEdit = (row) => { setEditingId(row.id); setEditData({ ...row }); };
  const saveEdit = () => {
    setRows(p => p.map(r => r.id === editingId ? { ...editData } : r));
    setEditingId(null);
  };
  const cancelEdit = () => { setEditingId(null); setEditData({}); };
  const addRow = () => {
    if (!newRow.size && !newRow.stock && !newRow.sales) return;
    setRows(p => [...p, { ...newRow, id: Date.now() }]);
    setNewRow({ size: '', stock: '', sales: '', date: new Date().toISOString().slice(0, 10) });
    setShowAddForm(false);
  };
  const deleteRow = (id) => { setRows(p => p.filter(r => r.id !== id)); setConfirmDelete(null); };
  const clearAll = () => { if (window.confirm('Clear ALL records?')) setRows([]); };

  const totalStock = rows.reduce((a, r) => a + (parseFloat(r.stock) || 0), 0);
  const totalSales = rows.reduce((a, r) => a + (parseFloat(r.sales) || 0), 0);

  return (
    <div className="sr-container">
      <div className="sr-header">
        <div className="sr-header-left">
          <div className="sr-icon-badge">LEDGER</div>
          <div>
            <h1 className="sr-title">Stock Register</h1>
            <p className="sr-subtitle">Manager-only inventory tracking ledger</p>
          </div>
        </div>
        <div className="sr-header-actions">
          <button className="sr-btn sr-btn-add" onClick={() => setShowAddForm(v => !v)}>
            + Add Entry
          </button>
          {rows.length > 0 && (
            <button className="sr-btn sr-btn-clear" onClick={clearAll}>Clear All</button>
          )}
        </div>
      </div>

      <div className="sr-stats">
        <div className="sr-stat">
          <span className="sr-stat-val">{rows.length}</span>
          <span className="sr-stat-label">Total Entries</span>
        </div>
        <div className="sr-stat">
          <span className="sr-stat-val">{totalStock.toLocaleString()}</span>
          <span className="sr-stat-label">Total Stock</span>
        </div>
        <div className="sr-stat">
          <span className="sr-stat-val">Rs.{totalSales.toLocaleString()}</span>
          <span className="sr-stat-label">Total Sales</span>
        </div>
        <div className="sr-stat">
          <span className="sr-manager-badge">Manager Only</span>
        </div>
      </div>

      {showAddForm && (
        <div className="sr-add-form">
          <h3 className="sr-add-title">New Entry</h3>
          <div className="sr-add-grid">
            <div className="sr-field">
              <label>Size</label>
              <input className="sr-input" placeholder="e.g. 25x25x2mm" value={newRow.size}
                onChange={e => setNewRow(p => ({ ...p, size: e.target.value }))} />
            </div>
            <div className="sr-field">
              <label>Stock (kg / pcs)</label>
              <input className="sr-input" type="number" placeholder="0" value={newRow.stock}
                onChange={e => setNewRow(p => ({ ...p, stock: e.target.value }))} />
            </div>
            <div className="sr-field">
              <label>Sales (Rs.)</label>
              <input className="sr-input" type="number" placeholder="0" value={newRow.sales}
                onChange={e => setNewRow(p => ({ ...p, sales: e.target.value }))} />
            </div>
            <div className="sr-field">
              <label>Date</label>
              <input className="sr-input" type="date" value={newRow.date}
                onChange={e => setNewRow(p => ({ ...p, date: e.target.value }))} />
            </div>
          </div>
          <div className="sr-add-actions">
            <button className="sr-btn sr-btn-add" onClick={addRow}>Save Entry</button>
            <button className="sr-btn sr-btn-cancel" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="sr-table-wrap">
        {rows.length === 0 ? (
          <div className="sr-empty">
            <div className="sr-empty-icon">No Records</div>
            <p>Click <strong>Add Entry</strong> to get started.</p>
          </div>
        ) : (
          <table className="sr-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Size</th>
                <th>Stock</th>
                <th>Sales (Rs.)</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id} className={editingId === row.id ? 'sr-row-editing' : ''}>
                  <td className="sr-sno">{idx + 1}</td>
                  {editingId === row.id ? (
                    <>
                      <td><input className="sr-inline-input" value={editData.size}
                        onChange={e => setEditData(p => ({ ...p, size: e.target.value }))} /></td>
                      <td><input className="sr-inline-input" type="number" value={editData.stock}
                        onChange={e => setEditData(p => ({ ...p, stock: e.target.value }))} /></td>
                      <td><input className="sr-inline-input" type="number" value={editData.sales}
                        onChange={e => setEditData(p => ({ ...p, sales: e.target.value }))} /></td>
                      <td><input className="sr-inline-input" type="date" value={editData.date}
                        onChange={e => setEditData(p => ({ ...p, date: e.target.value }))} /></td>
                      <td className="sr-actions">
                        <button className="sr-action-btn sr-save-btn" onClick={saveEdit}>Save</button>
                        <button className="sr-action-btn sr-cancel-btn" onClick={cancelEdit}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{row.size || '-'}</td>
                      <td>{row.stock || '-'}</td>
                      <td>{row.sales ? 'Rs.' + parseFloat(row.sales).toLocaleString() : '-'}</td>
                      <td>{row.date || '-'}</td>
                      <td className="sr-actions">
                        <button className="sr-action-btn sr-edit-btn" onClick={() => startEdit(row)}>Edit</button>
                        {confirmDelete === row.id ? (
                          <>
                            <button className="sr-action-btn sr-confirm-btn" onClick={() => deleteRow(row.id)}>Yes, Delete</button>
                            <button className="sr-action-btn sr-cancel-btn" onClick={() => setConfirmDelete(null)}>No</button>
                          </>
                        ) : (
                          <button className="sr-action-btn sr-del-btn" onClick={() => setConfirmDelete(row.id)}>Delete</button>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StockRegister;
