import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './menuManagement.css';

const MenuModal = ({ show, onClose, editingItem, onSubmit, formData, setFormData }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Preparation Time (minutes)"
                value={formData.preparationTime}
                onChange={(e) => setFormData({...formData, preparationTime: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
              required={!editingItem}
              className="file-input"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <select
                value={formData.dietType}
                onChange={(e) => setFormData({...formData, dietType: e.target.value})}
                required
              >
                <option value="">Select Diet Type</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-text">Loading...</div>
    </div>
  );

  return (
    <div className="menu-contain">
      <div className="menu-content">
        {successMessage && (
          <div className="alert success">{successMessage}</div>
        )}

        {error && (
          <div className="alert error">{error}</div>
        )}

        <div className="header">
          <h1>Menu Management</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Add New Item
          </button>
        </div>
          
         

        <MenuModal 
          show={showAddForm || editingItem !== null}
          onClose={() => {
            setShowAddForm(false);
            setEditingItem(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              image: null,
              category: '',
              dietType: '',
              preparationTime: ''
            });
          }}
          editingItem={editingItem}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
        />

        <div className="menu-grid">
          {menuItems.map((item) => (
            <div key={item.id} className="menu-card">
              <div className="menu-card-image">
                <img src={item.image} alt={item.name} />
                {item.dietType === 'Vegetarian' ? (
                  <span className="diet-badge veg"></span>
                ) : (
                  <span className="diet-badge non-veg"></span>
                )}
              </div>
              <div className="menu-card-content">
                <h3>{item.name}</h3>
                <p className="description">{item.description}</p>
                <div className="price-time">
                  <span className="price">₹{item.price}</span>
                  <span className="prep-time">{item.preparationTime} mins</span>
                </div>
                <div className="category">{item.category}</div>
                <div className="card-actions">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setFormData(item);
                      setShowAddForm(true);
                    }}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;