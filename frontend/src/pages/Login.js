import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // ⬅️ Add Link
import '../Login.css';

const Login = ({ setIsAuthenticated, setUserInfo }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Submitting data:', { username, password });

    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        username,
        password
      });

      // Store token and user info in localStorage
      localStorage.setItem('authToken', res.data.token);
      localStorage.setItem('userInfo', JSON.stringify(res.data.user));  // Store user info as stringified JSON

      // Set authentication state in parent component
      setIsAuthenticated(true);
      setUserInfo(res.data.user);

      setMessage('Login successful!');
      setTimeout(() => {
        navigate('/user-profile');
      }, 2000);
    } catch (err) {
      console.error("Login error:", err.response ? err.response.data : err);
      setMessage('Login failed.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p className="message">{message}</p>
        <p className="register-link">
          Don’t have an account?
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
