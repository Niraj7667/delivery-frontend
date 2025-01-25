import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
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
    setMessage(""); // Clear any previous messages

    try {
      // Send login request to the backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData,
        { withCredentials: true } // Include credentials (cookies)
      );

      // Extract token and store it
      const { token } = response.data;
      localStorage.setItem("usertoken", token);

      // Set global Axios authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Success message and navigation
      setMessage("Login successful!");
      navigate("/user/dashboard");
    } catch (error) {
      // Handle error responses
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred. Please try again.");
      }
    }
  };

  const handleNavigateToSignup = () => {
    navigate("/auth/user/signup");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

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

        <button className="login-button" type="submit">
          Login
        </button>

        {message && <p className="message">{message}</p>}

        <p>Don't have an account?</p>
        <button
          type="button"
          className="signup-btn"
          onClick={handleNavigateToSignup}
        >
          Go to Signup
        </button>
      </form>
    </div>
  );
};

export default Login;
