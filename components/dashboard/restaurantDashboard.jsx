import React from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantDashboard = () => {
  const navigate = useNavigate();

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
      </div>
    </div>
  );
};

export default RestaurantDashboard;
