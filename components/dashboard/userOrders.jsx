import React, { useState, useEffect } from "react";
import axios from "axios";
import "./userOrders.css";

export const Orders = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [inactiveOrders, setInactiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('usertoken');
        
      if (!token) {
        setError('No user token found');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/order/user`, {
        headers: {
          'Authorization': `usertoken ${token}`
        },
      });
      
      // Split orders based on isActive flag
      const allOrders = response.data;
      const active = allOrders.filter(order => order.isActive);
      const inactive = allOrders.filter(order => !order.isActive);

      setActiveOrders(active);
      setInactiveOrders(inactive);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.message || "Failed to fetch orders. Please try again.");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const OrderCard = ({ order, isHistory = false }) => (
    <div className={`order-card ${isHistory ? 'history' : ''}`}>
      <h3>Order #{order.id?.slice(-6)}</h3>
      <p className="restaurant-info">
        <strong>Restaurant:</strong> {order.restaurantName}
      </p>
      <p className="restaurant-location">
        <strong>Location:</strong> {order.restaurantAddress}
      </p>
      <p className="order-type">
        <strong>Type:</strong> {order.orderType?.replace(/_/g, ' ')}
      </p>
      {order.orderType === 'DINE_IN_ADVANCE' && order.mealTime && (
        <p className="meal-time">
          <strong>Meal Time:</strong> {formatDate(order.mealTime)}
        </p>
      )}
      {order.deliveryAddress && (
        <p className="delivery-address">
          <strong>Delivery Address:</strong> {order.deliveryAddress}
        </p>
      )}
      <div className="order-items">
        <strong>Items:</strong>
        <ul>
          {order.items?.map((item, index) => (
            <li key={index}>
              {item.menuItem?.name} x {item.quantity}
            </li>
          ))}
        </ul>
      </div>
      <p className="order-amount">
        <strong>Total:</strong> ₹{order.totalAmount}
      </p>
      <p className="order-status">
        <strong>Status:</strong> 
        <span className={`status ${order.status?.toLowerCase()}`}>
          {order.status}
        </span>
      </p>
      {order.createdAt && (
        <p className="order-date">
          <strong>Ordered on:</strong> {formatDate(order.createdAt)}
        </p>
      )}
      <p className="payment-method">
        <strong>Payment Method:</strong> {order.paymentMethod}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="active-orders">
        <h2 className="text-2xl font-bold mb-6">Active Orders</h2>
        {activeOrders.length > 0 ? (
          <div className="orders-list">
            {activeOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <p className="no-orders">No active orders</p>
        )}
      </div>

      <div className="order-history">
        <h2 className="text-2xl font-bold mb-6">Order History</h2>
        {inactiveOrders.length > 0 ? (
          <div className="orders-list">
            {inactiveOrders.map((order) => (
              <OrderCard key={order.id} order={order} isHistory={true} />
            ))}
          </div>
        ) : (
          <p className="no-orders">No order history</p>
        )}
      </div>
    </div>
  );
};

export default Orders;