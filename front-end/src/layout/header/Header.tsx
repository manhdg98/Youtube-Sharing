import './Header.scss';
import Container from 'react-bootstrap/Container';
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import Logo from '../../asset/images/logo.png';

const Header = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const isLoggedIn = localStorage.getItem('token');

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://youtubeshare.vercel.app/api/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      window.location.href = '/';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <Container>
      <header className="header-container">
        <div className="logo">
          <Link to="/"><img src={Logo} alt="Logo" /></Link> 
        </div>
        {!isLoggedIn ? (
        <div className="login-container">
          <input
            className="input-field"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="login-btn">Login</button>
          <button className="register-btn">
            <Link to="/register">Register</Link>
          </button>
        </div>
        ) : (
          <div className="login-container">
            <button className="register-btn" onClick={handleLogout}>
              <Link to="/">Logout</Link>
            </button>
          </div>
        )}
      </header>
    </Container>
  );
};

export default Header;
