import React, { useEffect, useState } from "react";
import "../styles/header.css";
import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaChevronDown,
  FaUserShield,
  FaEye,
  FaBars
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useRole } from "../context/RoleContext";

function Header({ onMenuClick }) {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { isManager } = useRole();

  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* Mobile hamburger menu button */}
        {onMenuClick && (
          <button className="mobile-menu-btn" onClick={onMenuClick}>
            <FaBars />
          </button>
        )}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products, orders, brands..."
          />
        </div>
      </div>

      <div className="header-right">
        <button className="notification-btn">
          <FaBell />
          <span className="notif-dot"></span>
        </button>

        <div className="profile-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <FaUserCircle className="profile-icon" />
          <div className="profile-info">
            <h4>{user ? user.name : "User"}</h4>
            <p className={isManager ? "role-tag manager" : "role-tag user"}>
              {isManager ? <><FaUserShield style={{marginRight:'4px', fontSize:'0.7rem'}}/> Manager</> : <><FaEye style={{marginRight:'4px', fontSize:'0.7rem'}}/> User</>}
            </p>
          </div>
          <FaChevronDown className="dropdown-arrow" />

          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={() => { navigate('/profile'); setDropdownOpen(false); }}>My Profile</button>
              {isManager && (
                <button onClick={() => { navigate('/settings'); setDropdownOpen(false); }}>Settings</button>
              )}
              <hr />
              <button className="logout-option" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
