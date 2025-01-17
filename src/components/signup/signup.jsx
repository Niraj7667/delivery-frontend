import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './signup.css'; // Import the CSS file

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
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
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        formData,
        {
          withCredentials: true,
        }
      );

      const { token } = response.data;
      localStorage.setItem("usertoken", token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setMessage(response.data.message);
      navigate('user/dashboard');
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    }
  };

  const handleNavigateToLogin = () => {
    navigate('/auth/login');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

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

        <button type="submit" className="login-button">Sign Up</button>
      </form>

      {message && <p>{message}</p>}

      {/* Text and Login button in one row */}
      <div className="login-row">
        <p>Already have an account?</p>
        <button onClick={handleNavigateToLogin} className="login-button">Login</button>
      </div>
    </div>
  );
};

export default Signup;
