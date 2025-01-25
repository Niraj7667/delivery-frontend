import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./userDashboard.css";
import Orders from "./userOrders";
import Menu from "../menu/menu";

const UserDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showOrders, setShowOrders] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

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
    setSelectedRestaurant(restaurantId);
  };

  return (
    <div className="user-dashboard">
      <header className="header">
        <h1>Welcome to Foodie's Paradise</h1>
        <button
        onClick={() => {
          navigate("/user/orders");
        }}
        className="toggle-button"
      >
        View Orders
      </button>
      </header>

      {showOrders ? (
        <Orders />
      ) : selectedRestaurant ? (
        <Menu 
          restaurantId={selectedRestaurant} 
          onClose={() => setSelectedRestaurant(null)} 
        />
      ) : (
        <section className="restaurant-list">
          <h2>Restaurants</h2>
          <ul>
            {restaurants.map((restaurant) => (
              <li key={restaurant.id} onClick={() => handleRestaurantSelect(restaurant.id)}>
                <h3>{restaurant.name}</h3>
                <p>{restaurant.location}</p>
                <span>Rating: {restaurant.rating.toFixed(1)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default UserDashboard;