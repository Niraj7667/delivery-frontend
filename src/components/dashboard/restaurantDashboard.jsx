import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import QRCodeGenerator from '../restaurantManage/qrCode';
import axios from 'axios';
import "./restaurantDashboard.css";

const RestaurantDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getRestaurantId = async () => {
      try { 
        const token = localStorage.getItem('restauranttoken');
        
        if (!token) {
          setError('No restaurant token found');
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/check/restaurant`, {
          headers: {
            Authorization: `restauranttoken ${token}`,
          },
        });

        if (response.data && response.data.restaurantId) {
          setRestaurantId(response.data.restaurantId);
        } else {
          setError('Restaurant ID not found in response');
          setLoading(false);
        }
      } catch (err) {
        console.error('Token verification error:', err);
        setError('Failed to verify restaurant token');
        setLoading(false);
      }
    };

    getRestaurantId();

    // Add scroll event listener for sticky header effect
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="dashboard-container">
      <header className={`sticky-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="restaurant-logo">
            <span className="logo-icon">🍔</span>
            <h1 className="restaurant-name">
              <span className="quick">Quick</span>
              <span className="bite">Bite</span>
            </h1>
          </div>
          <nav className="header-nav">
            <button className="nav-button" onClick={() => navigate('/restaurant/menu/manage')}>Menu</button>
            <button className="nav-button" onClick={() => navigate('/restaurant/order/manage')}>Orders</button>
            <button className="nav-button" onClick={() => navigate('/restaurant/profile')}>Profile</button>
          </nav>
        </div>
      </header>

      <div className="dashboard-header">
        <h1 className="dashboard-title">Restaurant Dashboard</h1>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate('/restaurant/menu/manage')}>
          <div className="card-icon">
            <span>🍽️</span>
          </div>
          <h2 className="card-title">Menu Management</h2>
          <p className="card-description">Add, update, or remove menu items for your restaurant</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/restaurant/order/manage')}>
          <div className="card-icon">
            <span>📋</span>
          </div>
          <h2 className="card-title">Order Management</h2>
          <p className="card-description">View and manage incoming orders and order history</p>
        </div>
      </div>
      
      {restaurantId && (
        <div className="qr-code-section">
          <h2 className="card-title">Restaurant QR Code</h2>
          <QRCodeGenerator restaurantId={restaurantId} />
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;