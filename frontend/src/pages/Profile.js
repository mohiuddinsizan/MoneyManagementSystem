import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { FaUser, FaMoneyBillWave, FaWallet } from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an image.");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post("http://localhost:5000/api/users/upload-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser((prevUser) => ({ ...prevUser, profileImage: response.data.profileImage }));
      setSelectedFile(null);
    } catch (error) {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleHistoryClick = () => {
    navigate("/history"); // Navigate to the history page
  };

  if (loading) return <p className="loading-text">Loading profile...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>Profile</h2>

        {/* Profile Image */}
        <div className="profile-image-container">
          <img
            src={user.profileImage || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-image"
          />
        </div>

        {/* Upload Section - Show Upload only if no image exists, otherwise show Update button */}
        <div className="upload-section">
          {!user.profileImage ? (
            <>
              <label htmlFor="file-upload" className="custom-file-upload">
                Choose File
              </label>
              <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} />
              <button className="upload-btn" onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
            </>
          ) : (
            <button className="update-btn" onClick={() => setUser((prev) => ({ ...prev, profileImage: "" }))}>
              Update Image
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="profile-info">
          <p><FaUser className="icon" /> <strong>Username:</strong> {user.username}</p>
          <p><FaMoneyBillWave className="icon" /> <strong>Total Debt:</strong> ${user.totalDebt}</p>
          <p><FaWallet className="icon" /> <strong>Total Credit:</strong> ${user.totalOwed}</p>
        </div>

        {/* Debts List */}
        <div className="debtdetails">
          <h3>Debts</h3>
          <ul>
            {user.debts.length > 0 ? (
              user.debts.map((debt, index) => (
                <li key={index}>
                  {debt.name}: ${debt.amount}
                  <br />
                  <span className="timestamp">
                    {new Date(debt.timestamp).toLocaleString()}
                  </span>
                </li>
              ))
            ) : (
              <p>Hurray !! ..No debts recorded.</p>
            )}
          </ul>
        </div>

        {/* Owed by Others List */}
        <div className="creditdetails">
          <h3>Credits</h3>
          <ul>
            {user.owedByOthers.length > 0 ? (
              user.owedByOthers.map((entry, index) => (
                <li key={index}>
                  {entry.name}: ${entry.amount}
                  <br />
                  <span className="timestamp">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </li>
              ))
            ) : (
              <p>No one owes you money.</p>
            )}
          </ul>
        </div>

        {/* Navigation Buttons */}
        <button className="navigate-btn" onClick={() => navigate("/moneyfeed")}>
          Go to Money Feed
        </button>

        <button className="navigate-btn" onClick={handleHistoryClick}>
          View Transaction History
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
