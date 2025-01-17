import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RestaurantLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/restaurant/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/auth/restaurant/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default RestaurantLogout;
