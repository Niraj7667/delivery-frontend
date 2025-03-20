import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./orderManagement.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('PENDING');

  const ORDER_STATUSES = ['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
  const ACTIVE_STATUSES = ['PENDING', 'PREPARING', 'READY'];

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('restauranttoken');
      if (!token) {
        setError('No restaurant token found');
        return;
      }

      const headers = { Authorization: `restauranttoken ${token}` };

      const [activeResponse, inactiveResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/order/restaurant`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/order/inactive`, { headers })
      ]);
    console.log(activeResponse);
    console.log(inactiveResponse);
      setOrders([...activeResponse.data, ...inactiveResponse.data]);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('restauranttoken');
      if (!token) {
        setError('No restaurant token found');
        return;
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/order/updatestatus/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `restauranttoken ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>Order Management</h1>
      <div className="category-tabs">
        {ORDER_STATUSES.map(status => (
          <button key={status} onClick={() => setActiveTab(status)} className={`category-tab ${activeTab === status ? 'active' : ''}`}>
            {status} ({orders.filter(order => order.status === status).length})
          </button>
        ))}
      </div>
      <div className="orders-list">
        {orders.filter(order => order.status === activeTab).length === 0 ? (
          <p className="no-orders">No orders in {activeTab} status</p>
        ) : (
          orders.filter(order => order.status === activeTab).map(order => (
            <div key={order.orderId} className={`order-card ${order.status.toLowerCase()}`}>
              <h3>Order #{order.orderId}</h3>
              <p>Customer: {order.userName}</p>
              <p>Phone: {order.phoneNumber}</p>
              <p>Meal Time: {new Date(order.mealTime).toLocaleString()}</p>
              <p>Order Type: {order.orderType.replace('_', ' ')}</p>
              <p>Payment Method: {order.paymentMethod.replace('_', ' ')}</p>
              {order.deliveryAddress && <p>Delivery Address: {order.deliveryAddress}</p>}
              <p className="amount">₹{order.totalAmount}</p>
              <p className={`status ${order.status.toLowerCase()}`}>{order.status}</p>
              <ul>
                {order.orderedItems.map((item, index) => (
                  <li key={index}>{item.name} x {item.quantity}</li>
                ))}
              </ul>
              <div className="order-buttons">
                {ACTIVE_STATUSES.includes(order.status) && (
                  <>
                    {order.status === 'PENDING' && <button onClick={() => handleStatusUpdate(order.orderId, 'PREPARING')}>Start Preparing</button>}
                    {order.status === 'PREPARING' && <button onClick={() => handleStatusUpdate(order.orderId, 'READY')}>Mark as Ready</button>}
                    {order.status === 'READY' && <button onClick={() => handleStatusUpdate(order.orderId, 'COMPLETED')}>Complete Order</button>}
                    <button className="cancel" onClick={() => handleStatusUpdate(order.orderId, 'CANCELLED')}>Cancel Order</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
