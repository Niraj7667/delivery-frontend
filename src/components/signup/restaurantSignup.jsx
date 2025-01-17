import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './auth.css';

const RestaurantSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    maxTables: "",
    openingHours: "",
  });
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
        `${import.meta.env.VITE_API_URL}/auth/restaurant/signup`,
        formData,
        { withCredentials: true }
      );

      setMessage(response.data.message);

      // Store the restaurant token in localStorage
      localStorage.setItem("restauranttoken", response.data.token);

      // Redirect to the restaurant dashboard
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
    navigate('/auth/restaurant/login');
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Restaurant Signup</h2>

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

        <div className="input-group">
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
          />
        </div>

        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>

      <div className="login-row">
        <p>Already have an account?</p>
        <button onClick={handleNavigateToLogin} className="login-button">Login</button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default RestaurantSignup;
