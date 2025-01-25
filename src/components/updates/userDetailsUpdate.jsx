import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css";

const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: [""],
  });

  const [message, setMessage] = useState("");

  // Fetch user profile data on component load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
            },
          }
        );
        setFormData({
          name: response.data.user.name,
          email: response.data.user.email,
          password: "",
          address: response.data.user.address || [""],
        });
      } catch (error) {
        setMessage("Failed to fetch profile data.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (name.startsWith("address-")) {
        const index = parseInt(name.split("-")[1], 10);
        const newAddress = [...prevData.address];
        newAddress[index] = value;
        return { ...prevData, address: newAddress };
      }
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleAddAddress = () => {
    setFormData((prevData) => ({
      ...prevData,
      address: [...prevData.address, ""],
    }));
  };

  const handleRemoveAddress = (index) => {
    setFormData((prevData) => {
      const newAddress = [...prevData.address];
      newAddress.splice(index, 1);
      return { ...prevData, address: newAddress };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
          },
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
        <h2>Update User Profile</h2>

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
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Address:</label>
          {formData.address.map((addr, index) => (
            <div key={index} className="address-group">
              <input
                type="text"
                name={`address-${index}`}
                value={addr}
                onChange={handleChange}
              />
              {formData.address.length > 1 && (
                <button
                  type="button"
                  className="remove-address"
                  onClick={() => handleRemoveAddress(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="add-address" onClick={handleAddAddress}>
            Add Address
          </button>
        </div>

        <button type="submit" className="profile-button">
          Update Profile
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default UserProfile;
