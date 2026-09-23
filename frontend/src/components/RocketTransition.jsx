import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './RocketTransition.css';

const RocketTransition = () => {
  const location = useLocation();
  const [flying, setFlying] = useState(false);
  const [direction, setDirection] = useState('right');
  const prevPath = useRef(location.pathname);
  const timerRef = useRef(null);

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      const prev = prevPath.current;
      const next = location.pathname;
      setDirection(next > prev ? 'right' : 'left');

      if (timerRef.current) clearTimeout(timerRef.current);
      setFlying(true);
      timerRef.current = setTimeout(() => {
        setFlying(false);
      }, 1200);

      prevPath.current = location.pathname;
    }
  }, [location.pathname]);

  if (!flying) return null;

  return (
    <div className={`rocket-transition-overlay direction-${direction}`}>
      <div className="rocket-trail" />
      <img src="/rocket.png" alt="Rocket" className="rocket-img" />
    </div>
  );
};

export default RocketTransition;
