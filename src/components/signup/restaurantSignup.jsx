import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./signup.css"; // Make sure this points to your CSS file

const RestaurantSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    maxTables: "",
    openingHours: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/restaurant/signup/sendotp`,
        { email: formData.email },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      setOtpSent(true);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/restaurant/signup`,
        formData,
        {
          withCredentials: true,
        }
      );

      const { token } = response.data;
      localStorage.setItem("restauranttoken", token);

      axios.defaults.withCredentials = true;

      setMessage(response.data.message);
      navigate("/restaurant/dashboard");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/auth/restaurant/login");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Restaurant Signup</h2>
        
        <div className="form-grid">
          <div className="input-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group full-width">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpSent}
              className="send-otp-button"
            >
              {otpSent ? "OTP Sent" : "Send OTP"}
            </button>
          </div>

          {otpSent && (
            <div className="input-group full-width">
              <label>OTP:</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="input-group full-width">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group full-width">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Max Tables:</label>
            <input
              type="number"
              name="maxTables"
              value={formData.maxTables}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Opening Hours:</label>
            <input
              type="text"
              name="openingHours"
              value={formData.openingHours}
              onChange={handleChange}
              required
              placeholder="e.g., 9:00 AM - 10:00 PM"
            />
          </div>
        </div>

        <button type="submit" className="login-button">
          Sign Up
        </button>

        {message && <p>{message}</p>}

        <div className="login-row">
          <p>Already have an account?</p>
          <button onClick={handleNavigateToLogin} className="login-button">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantSignup;