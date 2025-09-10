import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/userProfile';
import TravelLogs from './pages/TravelLogs';
import JourneyPlans from './pages/JourneyPlans';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Check if the user is authenticated when the app loads
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);

      // Retrieve user info if token exists
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        try {
          setUserInfo(JSON.parse(storedUserInfo));
        } catch (error) {
          console.error('Error parsing user info:', error);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
    localStorage.removeItem('authToken'); // Clear the token from localStorage
    localStorage.removeItem('userInfo'); // Clear user info from localStorage
  };

  return (
    <Router>
      <div className="App">
        <header className="header">
          <h1>Travel Blog</h1>
        </header>

        {/* ✅ Show navbar only if logged in */}
        {isAuthenticated && (
          <nav>
            <Link to="/travel-logs"><button>Travel Logs</button></Link>
            <Link to="/journey-plans"><button>Journey Plans</button></Link>
            <Link to="/user-profile"><button>Profile</button></Link>
            <button onClick={handleLogout}>Logout</button>
          </nav>
        )}

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} setUserInfo={setUserInfo} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-profile" element={isAuthenticated ? <UserProfile user={userInfo} /> : <Navigate to="/" />} />
          <Route path="/travel-logs" element={isAuthenticated ? <TravelLogs user={userInfo} /> : <Navigate to="/" />} />
          <Route path="/journey-plans" element={isAuthenticated ? <JourneyPlans user={userInfo} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
