import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
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
          <h2 className="text-xl font-bold">Menu QR Code</h2>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          {qrUrl && (
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <img 
                src={qrUrl} 
                alt="Menu QR Code"
                className="w-48 h-48 object-contain"
              />
            </div>
          )}
          
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full"
          >
            Download QR Code
          </button>
          
          <p className="text-sm text-gray-500 text-center">
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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Menu Items</h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 w-full">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/api/placeholder/400/320';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="48" 
                    height="48" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-gray-400"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <p className="text-xl font-bold text-green-600">₹{item.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRCodeGenerator;