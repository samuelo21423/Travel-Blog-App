// src/pages/userProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../userProfile.css';  // adjust path if needed

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const fetchUserData = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const res = await axios.get('http://localhost:5000/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load profile.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  if (error) return <div className="profile-container"><p>{error}</p></div>;
  if (!userData) return <div className="profile-container"><p>Loading profile…</p></div>;

  // Format the Joined date as "21 April 2025"
  const joinedDate = new Date(userData.createdAt || userData.joined || Date.now())
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          {userData.username.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{userData.username}</h2>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Joined:</strong> {joinedDate}</p>
          <p><strong>Address:</strong> {userData.address || 'Not provided'}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
