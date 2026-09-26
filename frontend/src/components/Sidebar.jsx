import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaBoxes,
  FaFileInvoiceDollar,
  FaClipboardList,
  FaIndustry,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaRobot,
  FaUserShield,
  FaEye,
  FaTable,
  FaGlobe,
  FaFileInvoice
} from 'react-icons/fa';
import { logoutUser } from '../services/authService';
import { useRole } from '../context/RoleContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isManager, role } = useRole();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-block">
          <div className="logo-icon">QS</div>
          <div>
            <h2 className="logo-text">Qadri Steel</h2>
            <span className="logo-subtitle">&amp; Tubes</span>
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>

      {/* Role badge in sidebar */}
      <div className="sidebar-role-badge">
        {isManager ? (
          <span className="sbadge manager"><FaUserShield /> Manager</span>
        ) : (
          <span className="sbadge viewer"><FaEye /> Viewer</span>
        )}
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>

        <NavLink to="/home" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
          <FaHome className="nav-icon" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
          <FaBoxes className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/catalog" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
          <FaBoxes className="nav-icon" />
          <span>Product Catalog</span>
        </NavLink>

        <NavLink to="/quotes" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
            <FaFileInvoiceDollar className="nav-icon" />
            <span>Quotations</span>
          </NavLink>

        <NavLink to="/stock-register" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
          <FaTable className="nav-icon" />
          <span>Stock Register</span>
        </NavLink>

        <NavLink to="/orders" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
          <FaClipboardList className="nav-icon" />
          <span>Orders</span>
        </NavLink>

                <NavLink to="/billing" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
          <FaFileInvoice className="nav-icon" />
          <span>Billing</span>
        </NavLink>

        <NavLink to="/explore" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
          <FaGlobe className="nav-icon" />
          <span>Explore QS</span>
        </NavLink>

        <div className="nav-section-label">Business</div>

        <NavLink to="/brands" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
          <FaIndustry className="nav-icon" />
          <span>Brands &amp; Suppliers</span>
        </NavLink>

        <NavLink to="/assistant" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
          <FaRobot className="nav-icon" />
          <span>AI Assistant</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
          <FaUserCircle className="nav-icon" />
          <span>Profile</span>
        </NavLink>

        {/* Settings — Manager only */}
        {isManager && (
          <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
            <FaCog className="nav-icon" />
            <span>Settings <span className="manager-pill">M</span></span>
          </NavLink>
        )}

        <button className="nav-item logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;



