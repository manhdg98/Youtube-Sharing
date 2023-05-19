import React, { useState } from 'react';
import axios from 'axios';
import './RegisterForm.scss';
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    try {
      await axios.post('https://youtubeshare.vercel.app/api/register', {
        username,
        password,
      });
      const responseLogin = await axios.post('https://youtubeshare.vercel.app/api/login', { username, password });
      const token = responseLogin.data.token;
      localStorage.setItem('token', token);

      window.location.href = '/';

    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="register-form-container">
      <h2 className="register-form-title">Register</h2>
      <form>
        <div className="register-form-field">
          <label className="register-form-label">Username:</label>
          <input
            className="register-form-input"
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="register-form-field">
          <label className="register-form-label">Password:</label>
          <input
            className="register-form-input"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button className="register-form-button" onClick={handleSubmit}>
            <Link to="/">Register</Link>
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
