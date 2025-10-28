import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TrainerProfile.css";

// Skeleton Loader Component
const TrainerProfileSkeleton = () => (
  <div className="trainer-profile-container">
    <div className="trainer-profile-card">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-field" />
      <div className="skeleton skeleton-field" />
      <div className="skeleton skeleton-field" />
      <div className="skeleton skeleton-field" />
      <div className="skeleton skeleton-btn" />
      <div className="skeleton skeleton-btn" />
    </div>
  </div>
);

const TrainerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState(null); // 👈 temp state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch Trainer profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token found");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/trainer/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data);
      } catch (err) {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    if (!isEditing) {
      // when entering edit mode, copy current profile
      setEditData({ ...profile });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found");
        return;
      }

      const payload = {
        fullName: editData.full_name,
        institute: editData.institute,
        phoneNumber: editData.phone_number,
      };

      await axios.put("http://localhost:5000/api/trainer/profile/update", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Profile updated successfully!");
      setProfile(editData); // ✅ update UI with saved data
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  const handleEditAccount = () => {
    navigate("/trainer-dashboard/profile/editaccount");
  };

  if (loading) return <TrainerProfileSkeleton />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="trainer-profile-container">
      <h1>Trainer Profile</h1>
      <div className="trainer-profile-card">
        {!isEditing ? (
          <>
            <p><strong>Full Name:</strong> {profile?.full_name}</p>
            <p><strong>Institute:</strong> {profile?.institute}</p>
            <p><strong>Phone Number:</strong> {profile?.phone_number}</p>
            <p><strong>Email:</strong> {profile?.email}</p>
            <button onClick={handleEditToggle}>Edit Profile</button>
            <button onClick={handleEditAccount}>Edit Account</button>
          </>
        ) : (
          <>
            <div>
              <label>Full Name: </label>
              <input
                type="text"
                name="full_name"
                value={editData.full_name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Institute: </label>
              <input
                type="text"
                name="institute"
                value={editData.institute}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Phone Number: </label>
              <input
                type="text"
                name="phone_number"
                value={editData.phone_number}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Email: </label>
              <input
                type="email"
                name="email"
                value={editData.email}
                disabled
              />
            </div>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleEditToggle}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TrainerProfile;
