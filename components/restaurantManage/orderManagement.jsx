import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManagement = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('restauranttoken');
      if (!token) {
        setError('No restaurant token found');
        return;
      }

      const headers = {
        Authorization: `restauranttoken ${token}`,
      };

      // Fetch both active and inactive orders
      const [activeResponse, inactiveResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/order/restaurant`, { 
            headers : {
                Authorization: `restauranttoken ${token}`,
              }
         }),
        axios.get(`${import.meta.env.VITE_API_URL}/order/inactive`, { 
            headers : {
                Authorization: `restauranttoken ${token}`,
              }
         })
      ]);

      const activeOrders = activeResponse.data;
      const inactiveOrders = inactiveResponse.data;

      setActiveOrders(activeOrders.filter(order => 
        order.status !== 'COMPLETED' && order.status !== 'CANCELLED'
      ));
      
      setOrderHistory([
        ...inactiveOrders,
        ...activeOrders.filter(order => 
          order.status === 'COMPLETED' || order.status === 'CANCELLED'
        )
      ]);

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
        
        const token = localStorage.getItem('restauranttoken');
        if (!token) {
            setError('No restaurant token found');
            return;
          }

      await axios.put(`${import.meta.env.VITE_API_URL}/order/updatestatus/${orderId}`, { status: newStatus },{
        headers: {
            Authorization: `restauranttoken ${token}`,
          },
      });
      fetchOrders();
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  const OrderCard = ({ order, showStatusUpdate = false }) => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Order #{order.orderId}</h3>
          <p className="text-gray-600">Customer: {order.userName}</p>
          <p className="text-gray-600">Phone: {order.phoneNumber}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">₹{order.totalAmount}</p>
          <p
            className={`text-sm ${
              order.status === 'COMPLETED'
                ? 'text-green-600'
                : order.status === 'CANCELLED'
                ? 'text-red-600'
                : 'text-blue-600'
            }`}
          >
            {order.status}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">Items:</h4>
        <ul className="list-disc list-inside">
          {order.orderedItems.map((item, index) => (
            <li key={index}>
              {item.name} x {item.quantity}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">Order Type: {order.orderType}</p>
        {order.deliveryAddress && <p className="text-gray-600">Delivery Address: {order.deliveryAddress}</p>}
        {order.mealTime && <p className="text-gray-600">Meal Time: {new Date(order.mealTime).toLocaleString()}</p>}
      </div>

      {showStatusUpdate && (
        <div className="flex gap-2">
          {order.status === 'PENDING' && (
            <button
              onClick={() => handleStatusUpdate(order.orderId, 'PREPARING')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Start Preparing
            </button>
          )}
          {order.status === 'PREPARING' && (
            <button
              onClick={() => handleStatusUpdate(order.orderId, 'READY')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Mark as Ready
            </button>
          )}
          {order.status === 'READY' && (
            <button
              onClick={() => handleStatusUpdate(order.orderId, 'COMPLETED')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Complete Order
            </button>
          )}
          {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
            <button
              onClick={() => handleStatusUpdate(order.orderId, 'CANCELLED')}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Cancel Order
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Order Management</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Active Orders ({activeOrders.length})</h2>
          {activeOrders.length === 0 ? (
            <p className="text-gray-600">No active orders</p>
          ) : (
            activeOrders.map(order => (
              <OrderCard key={order.orderId} order={order} showStatusUpdate={true} />
            ))
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Order History ({orderHistory.length})</h2>
          {orderHistory.length === 0 ? (
            <p className="text-gray-600">No order history</p>
          ) : (
            orderHistory.map(order => <OrderCard key={order.orderId} order={order} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;