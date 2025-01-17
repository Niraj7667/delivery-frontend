import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import QRCodeGenerator from '../restaurantManage/qrCode';
import axios from 'axios';


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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Restaurant Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button>
          <div
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/restaurant/menu/manage')} // Absolute path
          >
            
            <h2 className="text-xl font-semibold mb-2">Menu Management</h2>
            <p className="text-gray-600">Add, update, or remove menu items for your restaurant</p>
          </div>
          </button>

          <button>
          <div 
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/restaurant/order/manage')} // Absolute path
          >
            <h2 className="text-xl font-semibold mb-2">Order Management</h2>
            <p className="text-gray-600">View and manage incoming orders and order history</p>
          </div>
          </button>
        </div>
        <QRCodeGenerator restaurantId={restaurantId} />
      </div>
    </div>
  );
};

export default RestaurantDashboard;
