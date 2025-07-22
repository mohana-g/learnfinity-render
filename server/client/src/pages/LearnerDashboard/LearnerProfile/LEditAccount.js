import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LEditAccount.css";

const LEditAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token found");
          setLoading(false);
          return;
        }
        const response = await axios.get("http://localhost:5000/api/learner/profile", {
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
      alert("New passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found");
        return;
      }
      await axios.put(
        "http://localhost:5000/api/learner/update-password",
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
      navigate("/learner-dashboard/profile");
    } catch (err) {
      setError("Failed to update password");
    }
  };

  const handleBack = () => {
    navigate("/learner-dashboard/profile");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="edit-account-container">
      <h1>Edit Account</h1>
      <form className="edit-account-form" onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} disabled />
        </div>
        <div className="form-group">
          <label>Current Password:</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password:</label>
          <input
            type="password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="update-button">Update</button>
      </form>
      <button className="back-button" onClick={handleBack}>Back to Profile</button>
    </div>
  );
};

export default LEditAccount;
