import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
// import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const OrdersWithCategories = () => {
  const [orders, setOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('usertoken');
        if (!token) {
          setError('No user token found');
          setLoading(false);
          return;
        }
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/order/user`, {
          headers: {
            'Authorization': `usertoken ${token}`
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
    { name: "PENDING", count: orders.filter(order => order.status === "PENDING").length },
    { name: "PREPARING", count: orders.filter(order => order.status === "PREPARING").length },
    { name: "READY", count: orders.filter(order => order.status === "READY").length },
    { name: "COMPLETED", count: orders.filter(order => order.status === "COMPLETED").length },
    { name: "CANCELLED", count: orders.filter(order => order.status === "CANCELLED").length }
  ];

  const filteredOrders = orders.filter(order => order.status === selectedCategory);

  const formatCurrency = (amount) => {
    return `₹${amount}`;
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "PREPARING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "READY":
        return "bg-green-100 text-green-800 border-green-200";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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
    <div className="p-6">
      {/* Back Button */}
      <div className="mb-6">

        <button 
          variant="outline" 
          onClick={() => navigate('/user/dashboard')}
          className="flex items-center gap-2 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`
              px-6 py-3 rounded-lg flex flex-col items-center justify-center min-w-[140px]
              transition-all duration-200 border-2
              ${
                selectedCategory === category.name
                  ? "bg-blue-600 text-white border-blue-700 shadow-md"
                  : "bg-gray-50 hover:bg-gray-100 border-gray-200"
              }
            `}
          >
            <span className="font-semibold">{category.name}</span>
            <span className="text-sm mt-1">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className={`w-full border-l-4 ${getStatusStyles(order.status)}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id?.slice(-6)}</h3>
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-gray-600">
                  <span className="font-medium">Items:</span>{" "}
                  {order.items?.map(item => `${item.menuItem?.name} x ${item.quantity}`).join(", ")}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Total:</span>{" "}
                  {formatCurrency(order.totalAmount)}
                </p>
                {order.restaurantName && (
                  <p className="text-gray-600">
                    <span className="font-medium">Restaurant:</span>{" "}
                    {order.restaurantName}
                  </p>
                )}
                {order.deliveryAddress && (
                  <p className="text-gray-600">
                    <span className="font-medium">Delivery Address:</span>{" "}
                    {order.deliveryAddress}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders in this category
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersWithCategories;