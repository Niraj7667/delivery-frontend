import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

      const headers = {
        Authorization: `restauranttoken ${token}`,
      };

      const [activeResponse, inactiveResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/order/restaurant`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/order/inactive`, { headers })
      ]);

      const allOrders = [
        ...activeResponse.data,
        ...inactiveResponse.data
      ];

      setOrders(allOrders);
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
        {
          headers: {
            Authorization: `restauranttoken ${token}`,
          },
        }
      );
      fetchOrders();
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  const OrderCard = ({ order }) => (
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

      {ACTIVE_STATUSES.includes(order.status) && (
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
          <button
            onClick={() => handleStatusUpdate(order.orderId, 'CANCELLED')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  const filteredOrders = orders.filter(order => order.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Order Management</h1>

        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex gap-2">
            {ORDER_STATUSES.map(status => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status} ({orders.filter(order => order.status === status).length})
              </button>
            ))}
          </div>
        </div>

        <div>
          {filteredOrders.length === 0 ? (
            <p className="text-gray-600">No orders in {activeTab} status</p>
          ) : (
            filteredOrders.map(order => (
              <OrderCard key={order.orderId} order={order} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;