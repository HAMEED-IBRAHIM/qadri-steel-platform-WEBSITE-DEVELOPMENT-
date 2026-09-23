import React, { useState, useCallback, useEffect } from 'react';
import './Toast.css';

let addToastFn = null;

export const toast = {
  success: (msg) => addToastFn?.({ type: 'success', msg }),
  error: (msg) => addToastFn?.({ type: 'error', msg }),
  info: (msg) => addToastFn?.({ type: 'info', msg }),
  warning: (msg) => addToastFn?.({ type: 'warning', msg }),
};

const ICONS = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

const ToastProvider = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type, msg }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  useEffect(() => { addToastFn = addToast; return () => { addToastFn = null; }; }, [addToast]);

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{ICONS[t.type]}</span>
          <span>{t.msg}</span>
          <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>✕</button>
        </div>
      ))}
    </div>
  );
};

export default ToastProvider;
