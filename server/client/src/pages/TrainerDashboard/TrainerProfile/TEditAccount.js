import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Add axios for API calls
import './TEditAccount.css';

// Skeleton loader for Trainer Edit Account
const TEditAccountSkeleton = () => (
  <div className="Tedit-account-container1">
    <div className="skeleton skeleton-title" />
    <form className="Tedit-account-form">
      <div className="Tform-group">
        <div className="skeleton skeleton-field" />
      </div>
      <div className="Tform-group">
        <div className="skeleton skeleton-field" />
      </div>
      <div className="Tform-group">
        <div className="skeleton skeleton-field" />
      </div>
      <div className="Tform-group">
        <div className="skeleton skeleton-field" />
      </div>
      <div className="skeleton skeleton-btn" />
    </form>
    <div className="skeleton skeleton-btn" />
  </div>
);

const TEditAccount = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Trainer profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token found");
          setLoading(false);
          return;
        }

        const response = await axios.get("https://hilms.onrender.com/api/trainer/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData((prevData) => ({ ...prevData, email: response.data.email }));
      } catch (err) {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      alert('New passwords do not match!');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found");
        return;
      }

      await axios.put(
        "https://hilms.onrender.com/api/trainer/update-password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Password updated successfully!");
      navigate("/trainer-dashboard/profile"); // Navigate to Trainer Profile after update
    } catch (err) {
      setError("Failed to update password");
    }
  };

  const handleBack = () => {
    navigate("/trainer-dashboard/profile"); // Navigate back to Trainer Profile without any updates
  };

  // if (loading) return <p>Loading...</p>;
  if (loading) return <TEditAccountSkeleton />;

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="Tedit-account-container">
      <h1>Edit Trainer Profile</h1>
      <form className="Tedit-account-form" onSubmit={handleUpdate}>
        <div className="Tform-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled
          />
        </div>
        <div className="Tform-group">
          <label>Current Password:</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="Tform-group">
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="Tform-group">
          <label>Confirm New Password:</label>
          <input
            type="password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="Tupdate-button">
          Update
        </button>
      </form>
      <button className="Tback-button" onClick={handleBack}>
        Back to Profile
      </button>
    </div>
  );
};

export default TEditAccount;
