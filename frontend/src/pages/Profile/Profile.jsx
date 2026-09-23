
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    institution: '',
    department: '',
    research_interests: '',
    bio: '',
    location: '',
    website: '',
    phone: '',
    created_at: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://127.0.0.1:8001/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError('Error loading profile information.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: profile.name,
        role: profile.role,
        institution: profile.institution,
        department: profile.department,
        research_interests: profile.research_interests,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        phone: profile.phone
      };

      const response = await fetch('http://127.0.0.1:8001/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Update local storage so Header picks it up
      const currentUserData = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({...currentUserData, ...payload}));
      window.dispatchEvent(new Event('storage'));
      
    } catch (err) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="profile-container loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        {!isEditing ? (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
        ) : (
          <div className="action-buttons">
            <button className="cancel-btn" onClick={() => setIsEditing(false)} disabled={saving}>Cancel</button>
            <button className="save-btn" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-content">
        <div className="profile-section">
          <h2>Basic Information</h2>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={profile.name || ''} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={profile.email || ''} disabled />
            <small>Email cannot be changed.</small>
          </div>
          <div className="form-group">
            <label>Role / Title</label>
            <input type="text" name="role" value={profile.role || ''} onChange={handleChange} disabled={!isEditing} placeholder="e.g. Lead Researcher" />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea name="bio" value={profile.bio || ''} onChange={handleChange} disabled={!isEditing} placeholder="Tell us about yourself..." rows="4" />
          </div>
        </div>

        <div className="profile-section">
          <h2>Professional Details</h2>
          <div className="form-group">
            <label>Institution / Company</label>
            <input type="text" name="institution" value={profile.institution || ''} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input type="text" name="department" value={profile.department || ''} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div className="form-group">
            <label>Research Interests</label>
            <input type="text" name="research_interests" value={profile.research_interests || ''} onChange={handleChange} disabled={!isEditing} placeholder="e.g. 3D Bioprinting, Hydrogels" />
          </div>
        </div>

        <div className="profile-section">
          <h2>Contact Information</h2>
          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" value={profile.location || ''} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input type="url" name="website" value={profile.website || ''} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" value={profile.phone || ''} onChange={handleChange} disabled={!isEditing} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
