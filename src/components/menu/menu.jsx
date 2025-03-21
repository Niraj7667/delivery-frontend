import React, { useState, useEffect } from "react";
import axios from "axios";
import { OrderForm } from "./order";
import { ImageIcon } from "lucide-react";

import { useParams } from "react-router-dom";
 import { useNavigate } from "react-router-dom";

const MenuSelection = ({ menuItems, selectedItems, handleQuantityChange, totalAmount, onProceedToOrder }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleItemExpansion = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Menu Items</h2>
      <div className="menu-items">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item" onClick={() => toggleItemExpansion(item.id)}>
            <div className={`relative w-full transition-all ${expandedItems[item.id] ? 'h-auto' : 'h-24'}`}>
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/api/placeholder/400/320';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-4">
              <div className={`mb-4 ${expandedItems[item.id] ? '' : 'overflow-hidden text-ellipsis'}`}>
                <h3 className={`text-lg font-semibold mb-2 ${expandedItems[item.id] ? '' : 'whitespace-nowrap'}`}>{item.name}</h3>
                {expandedItems[item.id] && (
                  <>
                    {/* <p className="text-gray-600 text-sm mb-2">{item.description}</p> */}
                    <p className="text-xl font-bold text-green-600">₹{item.price}</p>
                  </>
                )}
              </div>
              {expandedItems[item.id] && (
                <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuantityChange(item.id, -1);
                  }}
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  disabled={!selectedItems.find((i) => i.id === item.id)?.quantity}
                >
                  -
                </button>
                <span className="w-8 text-center">
                  {selectedItems.find((i) => i.id === item.id)?.quantity || 0}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuantityChange(item.id, 1);
                  }}
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              
              )}
            </div>
            
          </div>
          
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <p className="text-gray-600">
              Total Items: {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}
            </p>
            <p className="text-xl font-bold text-green-600">
              Total Amount: ₹{totalAmount}
            </p>
          </div>
          <button
            onClick={onProceedToOrder}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 border border-green-800"

          >
            Proceed to Order
          </button>
        </div>
      </div>
    </>
  );
};

import "./menu.css";

const Menu = ({  onClose }) => {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  const fetchMenuItems = async () => {
    try {
      const usertoken = localStorage.getItem("usertoken");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/menu/items/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${usertoken}`,
        },
      });
      
      const menuItemsWithImages = response.data.menuItems.map(item => ({
        ...item,
        imageUrl: item.imageUrl || item.image 
      }));
      
      setMenuItems(menuItemsWithImages);
      setLoading(false);
    } catch (error) {
      setError("Failed to load menu items");
      setLoading(false);
    }
  };

  const handleQuantityChange = (itemId, change) => {
    const updatedItems = [...selectedItems];
    const existingItem = updatedItems.find(item => item.id === itemId);

    if (existingItem) {
      existingItem.quantity += change;
      if (existingItem.quantity <= 0) {
        const index = updatedItems.indexOf(existingItem);
        updatedItems.splice(index, 1);
      }
    } else if (change > 0) {
      const menuItem = menuItems.find(item => item.id === itemId);
      updatedItems.push({ ...menuItem, quantity: 1 });
    }

    setSelectedItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalAmount(total);
  };

  const handleProceedToOrder = () => {
    const usertoken = localStorage.getItem("usertoken");
    if (selectedItems.length === 0) {
      setError("Please select at least one item");
      return;
    }
    if (!usertoken || usertoken.length === 0) {
      setError("Please login or Signup");
      console.log(usertoken);
      return;
  }
    setShowOrderForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="menu-container">

      <header className="header">
         <h1>Welcome to Foodie's Paradise</h1>
         <button onClick={() => navigate("/user/orders")} className="toggle-button">
          View Orders
         </button>
      </header>

      {!showOrderForm ? (
        <MenuSelection
          menuItems={menuItems}
          selectedItems={selectedItems}
          handleQuantityChange={handleQuantityChange}
          totalAmount={totalAmount}
          onProceedToOrder={handleProceedToOrder}
        />
      ) : (
        <OrderForm
          restaurantId={restaurantId}
          selectedItems={selectedItems}
          totalAmount={totalAmount}
          onClose={onClose}
          onBack={() => setShowOrderForm(false)}
        />
      )}
    </div>
  );
};

export default Menu;

