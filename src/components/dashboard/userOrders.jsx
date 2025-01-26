import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./userOrders.css";

export const OrdersWithCategories = () => {
  const [orders, setOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("usertoken");
        if (!token) {
          setError("No user token found");
          setLoading(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/order/user`, {
          headers: {
            Authorization: `usertoken ${token}`,
          },
        });
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const categories = [
    { name: "PENDING", count: orders.filter((order) => order.status === "PENDING").length },
    { name: "PREPARING", count: orders.filter((order) => order.status === "PREPARING").length },
    { name: "READY", count: orders.filter((order) => order.status === "READY").length },
    { name: "COMPLETED", count: orders.filter((order) => order.status === "COMPLETED").length },
    { name: "CANCELLED", count: orders.filter((order) => order.status === "CANCELLED").length },
  ];

  const filteredOrders = orders.filter((order) => order.status === selectedCategory);

  const formatCurrency = (amount) => {
    return `₹${amount}`;
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="orders-container">
      {/* Back Button */}
      <div className="back-button" onClick={() => navigate("/user/dashboard")}>
        <ArrowLeft className="icon" color="black"/> Back to Dashboard
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`category-tab ${selectedCategory === category.name ? "active" : ""}`}
          >
            <span className="category-name">{category.name}</span>
            <span className="category-count">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.map((order) => (
          <Card key={order.id} className={`order-card ${order.status.toLowerCase()}`}>
            <CardContent>
              <div className="order-header">
                <h3>Order #{order.id?.slice(-6)}</h3>
                <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
              </div>
              <div className="order-details">
                <p>
                  <strong>Items:</strong> {order.items?.map((item) => `${item.menuItem?.name} x ${item.quantity}`).join(", ")}
                </p>
                <p>
                  <strong>Total:</strong> {formatCurrency(order.totalAmount)}
                </p>
                {order.restaurantName && (
                  <p>
                    <strong>Restaurant:</strong> {order.restaurantName}
                  </p>
                )}
                {order.deliveryAddress && (
                  <p>
                    <strong>Delivery Address:</strong> {order.deliveryAddress}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredOrders.length === 0 && <div className="no-orders">No orders in this category</div>}
      </div>
    </div>
  );
};

export default OrdersWithCategories;
