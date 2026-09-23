import React, { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext(null);

// ── Manager credentials (change these to whatever you like) ──
const MANAGER_USERNAME = 'HAMEED111';
const MANAGER_PASSWORD = 'HAMEED1110';

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('qst_role') || 'viewer';
  });

  const loginAsManager = (username, password) => {
    if (username === MANAGER_USERNAME && password === MANAGER_PASSWORD) {
      setRole('manager');
      localStorage.setItem('qst_role', 'manager');
      return true;
    }
    return false;
  };

  const setViewer = () => {
    setRole('viewer');
    localStorage.setItem('qst_role', 'viewer');
  };

  const isManager = role === 'manager';

  return (
    <RoleContext.Provider value={{ role, isManager, loginAsManager, setViewer }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used inside RoleProvider');
  return ctx;
};
