import React, { useState } from "react";
import axios from "axios";
import './order.css';

export const OrderForm = ({ restaurantId, selectedItems, totalAmount, onClose, onBack }) => {
  const [orderDetails, setOrderDetails] = useState({
    orderType: "",
    deliveryAddress: "",
    mealTime: "",
    paymentMethod: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const createOrder = async (paymentMethod) => {
    try {
      setLoading(true);
  
      // Determine the endpoint based on the order type
      let endpoint = `${import.meta.env.VITE_API_URL}/order/create`;
      if (orderDetails.orderType === "HOME_DELIVERY") {
        endpoint = `${import.meta.env.VITE_API_URL}/order/create/online`;
      } else if (orderDetails.orderType === "DINE_IN_ADVANCE") {
        endpoint = `${import.meta.env.VITE_API_URL}/order/create/dineinadvance`;
      }
  
      const orderData = {
        restaurantId,
        menuItems: selectedItems.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
        orderType: orderDetails.orderType,
        paymentMethod,
        totalAmount,
      };
  
      // Include specific fields based on the order type
      if (orderDetails.orderType === "HOME_DELIVERY") {
        orderData.deliveryAddress = orderDetails.deliveryAddress;
      } else if (orderDetails.orderType === "DINE_IN_ADVANCE") {
        orderData.mealTime = orderDetails.mealTime;
      }
  
      const token = localStorage.getItem('usertoken');
      if (!token) {
        setError('No user token found');
        setLoading(false);
        return;
      }
      console.log(token)
      // Send the request to the determined endpoint
      const response = await axios.post(endpoint, orderData, {
        headers: {
          Authorization: `usertoken ${token}`, // Ensure proper formatting
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };
  

  const handleOrderSubmit = async () => {
    try {
      // Validation
      if (!orderDetails.orderType) {
        setError("Please select an order type");
        return;
      }
  
      if (orderDetails.orderType === "HOME_DELIVERY" && !orderDetails.deliveryAddress) {
        setError("Please enter delivery address");
        return;
      }
  
      if (orderDetails.orderType === "DINE_IN_ADVANCE") {
        const selectedTime = new Date(orderDetails.mealTime);
        const currentTime = new Date();
        const minAllowedTime = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
        const maxAllowedTime = new Date();
        maxAllowedTime.setDate(currentTime.getDate() + 10); // 10 days from now
      
        const selectedHour = selectedTime.getHours();
        if (!orderDetails.mealTime) {
          setError("Please select a meal time.");
          return;
        } else if (selectedTime < minAllowedTime) {
          setError("Meal time must be at least 2 hours from now.");
          return;
        } else if (selectedTime > maxAllowedTime) {
          setError("You can only book for the next 10 days.");
          return;
        } else if (selectedHour < 10 || selectedHour >= 22) {
          setError("Meal time must be between 10:00 AM and 10:00 PM.");
          return;
        }
        
        // Create the order with 50% advance payment
        await createOrder("ONLINE_PAYMENT");
        alert(`Order placed successfully! Please pay ₹${(totalAmount * 0.5).toFixed(2)} at the restaurant.`);
        onClose();
      }
      
    } catch (error) {
      setError(error.message);
    }
  
    console.log("Payment Method:", orderDetails.paymentMethod); // Debugging purpose
    console.log("Restaurant ID:", restaurantId);
    console.log("Selected Items:", selectedItems);
    console.log("Order Type:", orderDetails.orderType);
    console.log("Delivery Address:", orderDetails.deliveryAddress);
    console.log("Meal Time:", orderDetails.mealTime);
  };
  

  // Show payment methods based on order type
  const renderPaymentMethods = () => {
    if (orderDetails.orderType === "HOME_DELIVERY") {
      return (
        <select
          value={orderDetails.paymentMethod}
          onChange={(e) => setOrderDetails({ ...orderDetails, paymentMethod: e.target.value })}
          className="w-full p-2 border rounded mt-4"
        >
          <option value="">Select Payment Method</option>
          <option value="ONLINE_PAYMENT">Online Payment</option>
          <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
        </select>
      );
    }

    if (orderDetails.orderType === "TABLE_ORDER") {
      return (
        <select
          value={orderDetails.paymentMethod}
          onChange={(e) => setOrderDetails({ ...orderDetails, paymentMethod: e.target.value })}
          className="w-full p-2 border rounded mt-4"
        >
          <option value="">Select Payment Method</option>
          <option value="ONLINE_PAYMENT">Online Payment</option>
          <option value="PAY_AT_RESTAURANT">Pay at Restaurant</option>
        </select>
      );
    }

    return null;
  };

  

  return (
    <div className="order-form-container">
      <div className="order-form">
        <h2 className="form-title">Complete Your Order</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-section">
          <label className="input-label">Order Type</label>
          <select
            value={orderDetails.orderType}
            onChange={(e) =>
              setOrderDetails({
                ...orderDetails,
                orderType: e.target.value,
                paymentMethod: ""
              })
            }
            className="form-select"
          >
            <option value="">Select Order Type</option>
            <option value="HOME_DELIVERY">Home Delivery</option>
            <option value="DINE_IN_ADVANCE">Dine In Advance</option>
            {/* <option value="TABLE_ORDER">Table Order</option> */}
          </select>
        </div>

        {orderDetails.orderType === "HOME_DELIVERY" && (
          <div className="form-section">
            <label className="input-label">Delivery Address</label>
            <textarea
              placeholder="Enter your complete delivery address"
              value={orderDetails.deliveryAddress}
              onChange={(e) => setOrderDetails({ ...orderDetails, deliveryAddress: e.target.value })}
              className="form-textarea"
            />
          </div>
        )}

        {orderDetails.orderType === "DINE_IN_ADVANCE" && (
          <div className="form-section">
            <label className="input-label">Select Meal Time</label>
            <input
              type="datetime-local"
              value={orderDetails.mealTime}
              onChange={(e) => {
                const selectedTime = new Date(e.target.value);
                const currentTime = new Date();
                const minAllowedTime = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
                const maxAllowedTime = new Date();
                maxAllowedTime.setDate(currentTime.getDate() + 10); // 10 days from now

                const selectedHour = selectedTime.getHours();
                if (selectedTime < minAllowedTime) {
                  setError("Meal time must be at least 2 hours from now.");
                } else if (selectedTime > maxAllowedTime) {
                  setError("You can only book for the next 10 days.");
                } else if (selectedHour < 10 || selectedHour >= 22) {
                  setError("Meal time must be between 10:00 AM and 10:00 PM.");
                } else {
                  setError("");
                  setOrderDetails({ ...orderDetails, mealTime: e.target.value });
                }
              }}
              className="form-input"
            />
            {error && <div className="error-message">{error}</div>}
            <div className="info-box">
          <span className="info-icon">ⓘ</span>
          <div className="info-content">
            <p>50% advance payment (₹{(totalAmount * 0.5).toFixed(2)}) is required</p>
            <p className="time-note">• Booking hours: 10 AM to 10 PM</p>
            <p className="time-note">• Must be booked at least 2 hours in advance</p>
          </div>
        </div>
          </div>
        )}


        {orderDetails.orderType && (
          <div className="form-section">
            <label className="input-label">Payment Method</label>
            <select
              value={orderDetails.paymentMethod}
              onChange={(e) => setOrderDetails({ ...orderDetails, paymentMethod: e.target.value })}
              className="form-select"
            >
              <option value="">Select Payment Method</option>
              {orderDetails.orderType === "HOME_DELIVERY" && (
                <>
                  <option value="ONLINE_PAYMENT">Online Payment</option>
                  <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                </>
              )}
              {orderDetails.orderType === "DINE_IN_ADVANCE" && (
                <>
                  <option value="ONLINE_PAYMENT">Online Payment</option>
                </>
              )}
              {orderDetails.orderType === "TABLE_ORDER" && (
                <>
                  <option value="ONLINE_PAYMENT">Online Payment</option>
                  <option value="PAY_AT_RESTAURANT">Pay at Restaurant</option>
                </>
              )}
            </select>
          </div>
        )}

        <div className="order-summary">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-item">
            <span>Total Amount</span>
            <span className="amount">₹{totalAmount.toFixed(2)}</span>
          </div>
          {orderDetails.orderType === "DINE_IN_ADVANCE" && (
            <div className="summary-item">
              <span>Advance Payment (50%)</span>
              <span className="amount">₹{(totalAmount * 0.5).toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="button-group">
          <button
            onClick={onBack}
            disabled={loading}
            className="button secondary"
          >
            Back to Menu
          </button>
          <button
            onClick={handleOrderSubmit}
            disabled={loading}
            className="button primary"
          >
            {loading ? (
              <span className="loading-spinner">
                <span className="spinner"></span>
                Processing...
              </span>
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;