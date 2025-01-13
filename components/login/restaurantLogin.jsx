import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const RestaurantLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/restaurant/login`,
        formData,
        { withCredentials: true }
      );
      setMessage(response.data.message);
      
      // Store the restaurant token in localStorage
      localStorage.setItem("restauranttoken", response.data.token);

      // Redirect to the restaurant dashboard
      navigate("/restaurant/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data.message || "Invalid email or password"
      );
    }
  };

  const handleNavigateToSignup = () => {
    navigate('/auth/restaurant/signup');
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Restaurant Login</h2>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="auth-button">
          Login
        </button>
      </form>

      <div className="signup-row">
        <p>New User?</p>
        <button onClick={handleNavigateToSignup} className="signup-button">Sign Up</button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default RestaurantLogin;