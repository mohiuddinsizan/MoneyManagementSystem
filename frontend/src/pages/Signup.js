import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // Include the CSS for styling

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null); // For managing notifications
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }
    setLoading(true);
    setError(""); // Reset error on each new attempt
    try {
      await axios.post("http://localhost:5000/api/users/signup", { username, password });
      showNotification("Signup Successful!", "success");
      setTimeout(() => navigate("/login"), 2000); // Navigate after 2 seconds to let user see the success message
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      setError("User already exists or something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Hide the notification after 3 seconds
  };

  const goToLogin = () => {
    navigate("/login"); // Navigate to the /login page
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      {notification && (
        <div className={`notification ${notification.type}`}>
          <p>{notification.message}</p>
        </div>
      )}
      <form onSubmit={handleSignup} className="signup-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Signing Up..." : "Signup"}
        </button>
      </form>

      {/* Login Button */}
      <div className="login-redirect">
        <p>Already have an account?</p>
        <button type="button" className="login-btn" onClick={goToLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Signup;
