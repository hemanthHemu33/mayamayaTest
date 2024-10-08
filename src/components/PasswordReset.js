import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import config from './config.json';
import './PasswordReset.css';

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();

  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setResponseMessage('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch(`${config.AUTH_BASE_URL}/api/user/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: newPassword,
        }),
      });

      const data = await response.json();

      if (data.status === 200) {
        setResponseMessage(data.message);
        setLoginMessage('Your password has been successfully reset. Go to the homepage and log in using your new password.');
      } else {
        setResponseMessage('Something went wrong, please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('Failed to reset password. Please try again later.');
    }
  };

  const handleLogo = () => {
    navigate("/");
  }

  return (
    <div className="password-reset-container">
      {/* Header with Logo */}
      <header className="password-reset-header">
        <img src="/logo.svg" alt="Logo" className="logo" onClick={handleLogo} />
      </header>

      {/* Password Reset Form */}
      <div className="password-reset-form">
        <h2>Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span onClick={handlePasswordVisibility} className="password-toggle-icon">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span onClick={handleConfirmPasswordVisibility} className="password-toggle-icon">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Response message */}
          {responseMessage && <p className="response-message">{responseMessage}</p>}

          <button type="submit" className="submit-button">Reset Password</button>
        </form>

        {/* Show this message after a successful password reset */}
        {loginMessage && (
          <p className="login-message">
            Your password has been successfully reset. Go to the <Link to="/">homepage</Link> and log in using your new password.
          </p>
        )}
      </div>

      <footer className="footer">
        <p>Resume Forensics - A MayaMaya Product</p>
      </footer>
    </div>
  );
};

export default PasswordReset;
