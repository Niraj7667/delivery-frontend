import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./qrCode.css";

// QR Code Generator Component for Restaurant Dashboard
export const QRCodeGenerator = ({ restaurantId }) => {
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    const menuUrl = `${window.location.origin}/menu/public/${restaurantId}`;
    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(menuUrl)}`;
    setQrUrl(qrCodeApiUrl);
  }, [restaurantId]);

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'restaurant-menu-qr.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  return (
    <div className="qr-code-container">
      <div className="qr-code-content">
        <div className="header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <rect x="7" y="7" width="3" height="3"/>
            <rect x="14" y="7" width="3" height="3"/>
            <rect x="7" y="14" width="3" height="3"/>
            <rect x="14" y="14" width="3" height="3"/>
          </svg>
          <h2 className="title">Menu QR Code</h2>
        </div>

        <div className="qr-code-section">
          {qrUrl && (
            <div className="qr-code-image">
              <img 
                src={qrUrl} 
                alt="Menu QR Code"
                className="qr-code-img"
              />
            </div>
          )}

          <button
            onClick={handleDownload}
            className="download-btn"
          >
            Download QR Code
          </button>

          <p className="instructions">
            Scan this QR code to view the restaurant menu
          </p>
        </div>
      </div>
    </div>
  );
};

// Public Menu Component (Shown when QR code is scanned)
export const PublicMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const restaurantId = window.location.pathname.split('/').pop();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/menu/items/${restaurantId}`);
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

    fetchMenuItems();
  }, [restaurantId]);

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
    <div className="public-menu-container">
      <div className="restaurant-header">
        <h1>Restaurant Name</h1>
        <p className="restaurant-location">📍 Location | 🕒 11 AM - 11 PM</p>
      </div>

      <div className="menu-gridd">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-card">
            {item.category && (
              <div className="category-badge">{item.category}</div>
            )}

            <div className="card-image">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-food.jpg';
                  }}
                />
              ) : (
                <div className="image-fallback">
                  <svg /* placeholder SVG */ />
                </div>
              )}
            </div>

            <div className="card-content">
              <h3 className="card-title">
                {item.name}
                <span className="veg-nonveg-tag veg-tag" /> {/* Add logic for veg/non-veg */}
              </h3>
              <p className="card-description">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="price-tag">{item.price}</span>
                <button className="add-to-cart-btn">
                  <span>Add +</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRCodeGenerator;
