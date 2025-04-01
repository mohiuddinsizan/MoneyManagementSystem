import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file
import { FaUser, FaLock } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaGoogle } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null); // State for notification
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/users/login", {
        username,
        password,
      });
      localStorage.setItem("token", data.token);
      setNotification({ type: "success", message: "Login Successful!" });
      setTimeout(() => setNotification(null), 3000); // Remove notification after 3 seconds
      navigate("/profile");
    } catch (error) {
      setNotification({ type: "error", message: "Invalid credentials!" });
      setTimeout(() => setNotification(null), 3000); // Remove notification after 3 seconds
    }
  };

  const goToSignup = () => {
    navigate("/signup"); // Navigate to the /signup page
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-box">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Type your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-box">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Type your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">Login</button>

          <div className="social-login">
            <p>Or Sign up using</p>
          </div>

          {/* SignUp Button */}
          <button type="button" className="signup-btn" onClick={goToSignup}>
            SignUp
          </button>
        </form>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default Login;
