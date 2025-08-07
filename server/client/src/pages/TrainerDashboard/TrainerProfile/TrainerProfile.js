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

        const response = await axios.get("https://hilms.onrender.com/api/trainer/profile", {
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
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
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

      await axios.put("https://hilms.onrender.com/api/trainer/profile/update", profile, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  const handleEditAccount = () => {
    navigate("/trainer-dashboard/profile/editaccount");
  };

  // if (loading) return <p>Loading profile...</p>;
  if (loading) return <TrainerProfileSkeleton />;

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="trainer-profile-container">
      <h1>Trainer Profile</h1>
      <div className="trainer-profile-card">
        {!isEditing ? (
          <>
            <p><strong>Full Name:</strong> {profile?.fullName}</p>
            <p><strong>Institute:</strong> {profile?.institute}</p> {/* Updated field */}
            <p><strong>Phone Number:</strong> {profile?.phoneNumber}</p> {/* Updated field */}
            <p><strong>Email:</strong> {profile?.email}</p>
            <button onClick={handleEditToggle}>Edit Profile</button>
            <button onClick={handleEditAccount}>Edit Account</button>
          </>
        ) : (
          <>
            <div>
              <label>Full Name: </label>
              <input type="text" name="fullName" value={profile.fullName} onChange={handleInputChange} />
            </div>
            <div>
              <label>Institute: </label> {/* Updated field */}
              <input type="text" name="institute" value={profile.institute} onChange={handleInputChange} />
            </div>
            <div>
              <label>Phone Number: </label> {/* Updated field */}
              <input type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleInputChange} />
            </div>
            <div>
              <label>Email: </label>
              <input type="email" name="email" value={profile.email} onChange={handleInputChange} disabled />
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
