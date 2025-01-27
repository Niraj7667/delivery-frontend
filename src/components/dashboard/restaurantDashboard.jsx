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
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <h1 className="dashboard-title">Restaurant Dashboard</h1>

        <div className="dashboard-grid">
          <button className="dashboard-card" onClick={() => navigate('/restaurant/menu/manage')}>
            <h2 className="card-title">Menu Management</h2>
            <p className="card-description">Add, update, or remove menu items for your restaurant</p>
          </button>

          <button className="dashboard-card" onClick={() => navigate('/restaurant/order/manage')}>
            <h2 className="card-title">Order Management</h2>
            <p className="card-description">View and manage incoming orders and order history</p>
          </button>
        </div>
        <QRCodeGenerator restaurantId={restaurantId} />
      </div>
    </div>
  );
};

export default RestaurantDashboard;
