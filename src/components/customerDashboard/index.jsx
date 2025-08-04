import React, { useState } from "react";
import './index.css';
import logo from '../../images/logo.jpeg'
import { Box } from "@mui/material";


const CustomerDashboard = () => {
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{10,15}$/.test(mobile)) {
      setError("Enter a valid mobile number.");
      return;
    }
    setError("");
    // Proceed with your OTP sending or login workflow
    alert(`Login for: ${countryCode} ${mobile}`);
  };

  return (
    <Box className='login-page-outer'>
      <Box className="login-card">
      <img 
    src={logo} 
    alt="Illustration" 
    className="header-img"
  />
        <h2 className="login-title">Enter your mobile number</h2>
        <p className="login-subtitle">
        </p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <Box className="input-row">
            <Box className="country-code-box">
              <select
                className="country-code-select"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                <option value="+91">+91</option>
                {/* Add more country codes as needed */}
              </select>
            </Box>
            <Box className="mobile-input-box">
              <input
                type="tel"
                className="mobile-input"
                placeholder="Mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                maxLength={15}
                inputMode="numeric"
                required
              />
            </Box>
          </Box>
          {error && <Box className="login-error">{error}</Box>}
          <button className="main-btn" type="submit">
            CONTINUE
          </button>
        </form>
      </Box>
    </Box>
  );
};

export default CustomerDashboard;
