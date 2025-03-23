import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./userDashboard.css";

const UserDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [message, setMessage] = useState("");
  const [scrolled, setScrolled] = useState(false);
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
    
    // Add scroll event listener for header effect
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleRestaurantSelect = (restaurantId) => {
    navigate(`/user/menu/${restaurantId}`);
  };

  return (
    <div className="user-dashboard">
      <header className={`sticky-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="restaurant-logo" onClick={() => navigate('/user/dashboard')}>
            <span className="logo-icon">🍔</span>
            <h1 className="restaurant-name">
              <span className="quick">Quick</span>
              <span className="bite">Bite</span>
            </h1>
          </div>
          <nav className="header-nav">
            <button
              className="nav-button"
              onClick={() => navigate("/user/orders")}
            >
              View Orders
            </button>
          </nav>
        </div>
      </header>

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