import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./userDashboard.css";
import Orders from "./userOrders";

const UserDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try { 
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/order/restaurants`);
        setRestaurants(response.data);
      } catch (error) {
        setMessage("Failed to load restaurants. Please try again.");
      }
    };

    fetchRestaurants();
  }, []);

  const handleRestaurantSelect = (restaurantId) => {
    navigate(`/user/menu/${restaurantId}`);
  };

  return (
    <div className="user-dashboard">
      <div className="sticky-header-wrapper">
        <header className="header">
          <h1>Welcome to Foodie's Paradise</h1>
          <button onClick={() => navigate("/user/orders")} className="toggle-button">
            View Orders
          </button>
        </header>
      </div>

      <section className="restaurant-list">
        <h2>Restaurants</h2>
        <div className="restaurant-grid">
          {restaurants.map((restaurant) => (
            <div 
              key={restaurant.id} 
              className="restaurant-card"
              onClick={() => handleRestaurantSelect(restaurant.id)}
            >
              <h3>{restaurant.name}</h3>
              <p>{restaurant.location}</p>
              <span className="rating">Rating: {restaurant.rating.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </section>

      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default UserDashboard;