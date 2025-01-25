import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RestaurantProfile.css";

const RestaurantProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    maxTables: "",
    openingHours: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/restaurant/profile`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` },
          }
        );
        setFormData(response.data.restaurant);
      } catch (error) {
        setMessage("Failed to fetch profile data.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/restaurant/profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("usertoken")}` },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      <form className="profile-form" onSubmit={handleSubmit}>
        <h2>Update Restaurant Profile</h2>

        <div className="input-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Max Tables:</label>
          <input
            type="number"
            name="maxTables"
            value={formData.maxTables}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Opening Hours:</label>
          <textarea
            name="openingHours"
            value={formData.openingHours}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="profile-button">
          Update Profile
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default RestaurantProfile;
