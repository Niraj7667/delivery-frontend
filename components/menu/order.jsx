import React, { useState } from "react";
import axios from "axios";

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
        if (!orderDetails.mealTime) {
          setError("Please select meal time");
          return;
        }
        // Create order first with advance payment note
        await createOrder("ONLINE_PAYMENT");
        alert(`Order placed successfully! Please pay ₹${(totalAmount * 0.5).toFixed(2)} at the restaurant.`);
        onClose();
      } else if (orderDetails.paymentMethod === "ONLINE_PAYMENT") {
        // Create order with full payment note
        await createOrder("ONLINE_PAYMENT");
        alert("Order placed successfully! Please pay the full amount online.");
        onClose();
      } else {
        // For COD or PAY_AT_RESTAURANT, create order directly
        await createOrder(orderDetails.paymentMethod);
        alert("Order placed successfully!");
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
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Order Details</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <select
        value={orderDetails.orderType}
        onChange={(e) =>
          setOrderDetails({
            ...orderDetails,
            orderType: e.target.value,
            paymentMethod: "" // Reset payment method when order type changes
          })
        }
        className="w-full p-2 border rounded"
      >
        <option value="">Select Order Type</option>
        <option value="HOME_DELIVERY">Home Delivery</option>
        <option value="DINE_IN_ADVANCE">Dine In Advance</option>
        <option value="TABLE_ORDER">Table Order</option>
      </select>

      {orderDetails.orderType === "HOME_DELIVERY" && (
        <textarea
          placeholder="Delivery Address"
          value={orderDetails.deliveryAddress}
          onChange={(e) => setOrderDetails({ ...orderDetails, deliveryAddress: e.target.value })}
          className="w-full p-2 border rounded mt-4 min-h-[100px]"
        />
      )}

      {orderDetails.orderType === "DINE_IN_ADVANCE" && (
        <div className="mt-4">
          <input
            type="datetime-local"
            value={orderDetails.mealTime}
            onChange={(e) => setOrderDetails({ ...orderDetails, mealTime: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <p className="text-sm text-gray-600 mt-2">
            Note: 50% advance payment (₹{(totalAmount * 0.5).toFixed(2)}) is required
          </p>
        </div>
      )}

      {renderPaymentMethods()}

      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <p>Total Amount: ₹{totalAmount.toFixed(2)}</p>
        {orderDetails.orderType === "DINE_IN_ADVANCE" && (
          <p>Advance Payment (50%): ₹{(totalAmount * 0.5).toFixed(2)}</p>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleOrderSubmit}
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Confirm Order"}
        </button>
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default OrderForm;

















// import React, { useState } from "react";
// import axios from "axios";

// export const OrderForm = ({ restaurantId, selectedItems, totalAmount, onClose, onBack }) => {
//   const [orderDetails, setOrderDetails] = useState({
//     orderType: "",
//     deliveryAddress: "",
//     mealTime: "",
//     paymentMethod: ""
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handlePayment = async (amount) => {
//     try {
//       setLoading(true);
//       // Create payment order
//       const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/create`, {
//         orderId: orderId, // You'll need to create the order first
//         amount: amount
//       });

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: amount * 100,
//         currency: "INR",
//         name: "Restaurant Name",
//         description: "Food Order Payment",
//         order_id: response.data.id,
//         handler: async (response) => {
//           try {
//             // Verify payment
//             const verification = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/verify`, {
//               orderId: orderId,
//               razorpayOrderId: response.razorpay_order_id,
//               razorpayPaymentId: response.razorpay_payment_id,
//               razorpaySignature: response.razorpay_signature
//             });

//             if (verification.data.success) {
//               alert("Payment successful! Order confirmed.");
//               onClose();
//             }
//           } catch (error) {
//             setError("Payment verification failed");
//           }
//         },
//         prefill: {
//           name: localStorage.getItem("userName"),
//           email: localStorage.getItem("userEmail"),
//           contact: localStorage.getItem("userPhone")
//         },
//         theme: {
//           color: "#3399cc"
//         }
//       };

//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open();
//     } catch (error) {
//       setError("Payment initialization failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createOrder = async (paymentMethod) => {
//     try {
//       setLoading(true);
//       const orderData = {
//         restaurantId,
//         items: selectedItems.map(item => ({
//           menuItemId: item.id,
//           quantity: item.quantity
//         })),
//         orderType: orderDetails.orderType,
//         paymentMethod,
//         totalAmount
//       };

//       if (orderDetails.orderType === "HOME_DELIVERY") {
//         orderData.deliveryAddress = orderDetails.deliveryAddress;
//       }

//       if (orderDetails.orderType === "DINE_IN_ADVANCE") {
//         orderData.mealTime = orderDetails.mealTime;
//       }
      
      

//       const response = await axios.post(`${import.meta.env.VITE_API_URL}/order/create`, orderData);
//       return response.data;
//     } catch (error) {
//       throw new Error("Failed to create order");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOrderSubmit = async () => {
//     try {
//       // Validation
//       if (!orderDetails.orderType) {
//         setError("Please select an order type");
//         return;
//       }

//       if (orderDetails.orderType === "HOME_DELIVERY" && !orderDetails.deliveryAddress) {
//         setError("Please enter delivery address");
//         return;
//       }

//       if (orderDetails.orderType === "DINE_IN_ADVANCE") {
//         if (!orderDetails.mealTime) {
//           setError("Please select meal time");
//           return;
//         }
//         // Create order first
//         const order = await createOrder("ONLINE_PAYMENT");
//         // Process 50% payment
//         await handlePayment(totalAmount * 0.5);
//       } else if (orderDetails.paymentMethod === "ONLINE_PAYMENT") {
//         // Create order first
//         const order = await createOrder("ONLINE_PAYMENT");
//         // Process full payment
//         await handlePayment(totalAmount);
//       } else {
//         // For COD or PAY_AT_RESTAURANT, create order directly
//         await createOrder(orderDetails.paymentMethod);
//         alert("Order placed successfully!");
//         onClose();
//       }
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   // Show payment methods based on order type
//   const renderPaymentMethods = () => {
//     if (orderDetails.orderType === "HOME_DELIVERY") {
//       return (
//         <select
//           value={orderDetails.paymentMethod}
//           onChange={(e) => setOrderDetails({ ...orderDetails, paymentMethod: e.target.value })}
//           className="w-full p-2 border rounded mt-4"
//         >
//           <option value="">Select Payment Method</option>
//           <option value="ONLINE_PAYMENT">Online Payment</option>
//           <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
//         </select>
//       );
//     }
    
//     if (orderDetails.orderType === "TABLE_ORDER") {
//       return (
//         <select
//           value={orderDetails.paymentMethod}
//           onChange={(e) => setOrderDetails({ ...orderDetails, paymentMethod: e.target.value })}
//           className="w-full p-2 border rounded mt-4"
//         >
//           <option value="">Select Payment Method</option>
//           <option value="ONLINE_PAYMENT">Online Payment</option>
//           <option value="PAY_AT_RESTAURANT">Pay at Restaurant</option>
//         </select>
//       );
//     }

//     return null;
//   };

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6">Order Details</h2>
      
//       {error && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
//           {error}
//         </div>
//       )}
      
//       <select
//         value={orderDetails.orderType}
//         onChange={(e) => setOrderDetails({ 
//           ...orderDetails, 
//           orderType: e.target.value,
//           paymentMethod: "" // Reset payment method when order type changes
//         })}
//         className="w-full p-2 border rounded"
//       >
//         <option value="">Select Order Type</option>
//         <option value="HOME_DELIVERY">Home Delivery</option>
//         <option value="DINE_IN_ADVANCE">Dine In Advance</option>
//         <option value="TABLE_ORDER">Table Order</option>
//       </select>

//       {orderDetails.orderType === "HOME_DELIVERY" && (
//         <textarea
//           placeholder="Delivery Address"
//           value={orderDetails.deliveryAddress}
//           onChange={(e) => setOrderDetails({ ...orderDetails, deliveryAddress: e.target.value })}
//           className="w-full p-2 border rounded mt-4 min-h-[100px]"
//         />
//       )}

//       {orderDetails.orderType === "DINE_IN_ADVANCE" && (
//         <div className="mt-4">
//           <input
//             type="datetime-local"
//             value={orderDetails.mealTime}
//             onChange={(e) => setOrderDetails({ ...orderDetails, mealTime: e.target.value })}
//             className="w-full p-2 border rounded"
//           />
//           <p className="text-sm text-gray-600 mt-2">
//             Note: 50% advance payment (₹{(totalAmount * 0.5).toFixed(2)}) is required
//           </p>
//         </div>
//       )}

//       {renderPaymentMethods()}

//       <div className="mt-6 p-4 bg-gray-50 rounded">
//         <h3 className="font-semibold mb-2">Order Summary</h3>
//         <p>Total Amount: ₹{totalAmount.toFixed(2)}</p>
//         {orderDetails.orderType === "DINE_IN_ADVANCE" && (
//           <p>Advance Payment (50%): ₹{(totalAmount * 0.5).toFixed(2)}</p>
//         )}
//       </div>

//       <div className="mt-6 flex gap-4">
//         <button
//           onClick={handleOrderSubmit}
//           disabled={loading}
//           className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
//         >
//           {loading ? "Processing..." : "Confirm Order"}
//         </button>
//         <button
//           onClick={onBack}
//           disabled={loading}
//           className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 disabled:opacity-50"
//         >
//           Back to Menu
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderForm;