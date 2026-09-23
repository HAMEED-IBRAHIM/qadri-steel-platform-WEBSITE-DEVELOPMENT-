import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight, FaMicrosoft, FaGoogle } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { useGoogleLogin } from '@react-oauth/google';
import { loginUser, googleOAuthLogin, microsoftOAuthLogin } from '../../services/authService';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { instance } = useMsal();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginUser(email, password);
      navigate('/initialize');
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        await googleOAuthLogin(tokenResponse.access_token);
        navigate('/initialize');
      } catch (err) {
        setError(err.message || "Google login failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError("Google Login Failed");
    }
  });

  const loginWithMicrosoft = async () => {
    setLoading(true);
    setError('');
    try {
      const loginResponse = await instance.loginPopup({ scopes: ["user.read"] });
      if (loginResponse.accessToken) {
        await microsoftOAuthLogin(loginResponse.accessToken);
        navigate('/initialize');
      }
    } catch (err) {
      setError(err.message || "Microsoft login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={`login-page ${isLoaded ? 'loaded' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="login-bg-mesh" />
      <div className="login-container">
        {/* Left Panel - Pure Photo Background */}
        <section className="login-left">
          <div className="login-left-bg">
            <img src="/poster.jpg" alt="1 Year Anniversary" className="shop-img" style={{objectFit: 'contain', backgroundColor: '#0c1520', opacity: 1}} />
          </div>
          <div className="left-content">
             
          </div>
        </section>

        {/* Right Login Section */}
        <section className="login-right">
          <div className="login-glass-card">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your steel business dashboard.</p>
            </div>

            {error && (
              <div className="auth-error-alert">
                {error}
              </div>
            )}

            <form className="premium-form" onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <FaEnvelope className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    placeholder="mail_id@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-options">
                <label className="remember-checkbox">
                  <input type="checkbox" />
                  Remember Me
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>

              <motion.button
                type="submit"
                className="submit-btn"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? 'Authenticating...' : <><span style={{display: 'inline-flex', alignItems: 'center', gap: '8px'}}>Sign In <FaArrowRight className="btn-arrow" /></span></>}
              </motion.button>
            </form>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="social-login">
              <button type="button" className="social-btn" onClick={loginWithMicrosoft} disabled={loading}>
                <FaMicrosoft className="social-icon ms" /> Microsoft
              </button>
              <button type="button" className="social-btn" onClick={() => loginWithGoogle()} disabled={loading}>
                <FaGoogle className="social-icon google" /> Google
              </button>
            </div>

            <div className="form-footer">
              <p>
                Don't have an account?{' '}
                <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
                  Create Account
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Login;
