import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null, // Changed from a string to null for file handling
    category: '',
    dietType: '',
    preparationTime: ''
  });

  // Get restaurant ID from token
  useEffect(() => {
    const getRestaurantId = async () => {
      try { 
        const token = localStorage.getItem('restauranttoken');
        
        if (!token) {
          setError('No restaurant token found');
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/check/restaurant`, {
          headers: {
            Authorization: `restauranttoken ${token}`,
          },
        });

        if (response.data && response.data.restaurantId) {
          setRestaurantId(response.data.restaurantId);
          fetchMenuItems(response.data.restaurantId);
        } else {
          setError('Restaurant ID not found in response');
          setLoading(false);
        }
      } catch (err) {
        console.error('Token verification error:', err);
        setError('Failed to verify restaurant token');
        setLoading(false);
      }
    };

    getRestaurantId();
  }, []);

  const fetchMenuItems = async (id) => {
    const fetchId = id || restaurantId;
    if (!fetchId) {
      setError('No restaurant ID available');
      setLoading(false);
      return;
    }

    try {
      const restauranttoken = localStorage.getItem('restauranttoken');
      
      if (!restauranttoken) {
        setError('No restaurant token found');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/menu/items/${fetchId}`, {
        headers: {
          Authorization: `restauranttoken ${restauranttoken}`
        }
      });

      if (response.data && response.data.menuItems) {
        setMenuItems(response.data.menuItems);
      } else {
        setError('Invalid response format from server');
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch menu items error:', err);
      setError(`Failed to fetch menu items: ${err.message}`);
      setLoading(false);
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const restauranttoken = localStorage.getItem('restauranttoken');
    
    try {
      // Prepare form data for file upload
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('dietType', formData.dietType);
      data.append('preparationTime', formData.preparationTime);
      data.append('restaurantId', restaurantId);
      if (formData.image) {
        data.append('image', formData.image); // Append image file
      }

      if (editingItem) {
        await axios.put(`${import.meta.env.VITE_API_URL}/menu/updateitems/${editingItem.id}`, 
          data,
          {
            headers: {
              Authorization: `restauranttoken ${restauranttoken}`,
              'Content-Type': 'multipart/form-data' // Required for file uploads
            }
          }
        );
        showSuccess('Item updated successfully!');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/menu/additems`,
          data,
          {
            headers: {
              Authorization: `restauranttoken ${restauranttoken}`,
              'Content-Type': 'multipart/form-data' // Required for file uploads
            }
          }
        );
        showSuccess('New item added successfully!');
      }

      // Reset form and fetch updated items
      setShowAddForm(false);
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        image: null, // Reset to null
        category: '',
        dietType: '',
        preparationTime: ''
      });
      fetchMenuItems(restaurantId);
    } catch (err) {
      console.error('Save menu item error:', err);
      setError('Failed to save menu item: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const restauranttoken = localStorage.getItem('restauranttoken');
      setError(null);
      
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/menu/deleteitems/${id}`, {
          headers: {
            Authorization: `restauranttoken ${restauranttoken}`
          }
        });
        showSuccess('Item deleted successfully!');
        fetchMenuItems(restaurantId);
      } catch (err) {
        console.error('Delete menu item error:', err);
        setError('Failed to delete item: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Item
          </button>
        </div>

        {(showAddForm || editingItem) && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
              {/* Updated input for image file */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                className="w-full p-2 border rounded"
                required={!editingItem} // Image required only for new items
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
              <select
                value={formData.dietType}
                onChange={(e) => setFormData({...formData, dietType: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Diet Type</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
              <input
                type="number"
                placeholder="Preparation Time (minutes)"
                value={formData.preparationTime}
                onChange={(e) => setFormData({...formData, preparationTime: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      image: null, // Reset to null
                      category: '',
                      dietType: '',
                      preparationTime: ''
                    });
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded mb-4"/>
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <p className="text-lg font-bold mb-2">₹{item.price}</p>
              <p className="text-sm text-gray-500 mb-4">
                {item.category} • {item.dietType} • {item.preparationTime} mins
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setFormData(item);
                    setShowAddForm(true);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
