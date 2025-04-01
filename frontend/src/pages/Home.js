import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Include the CSS for styling

const Home = () => {
  return (
    <div className="home-container">
      <div className="welcome-message">
        <h2>Welcome to the Money Managment</h2>
        <p>Please login or sign up to continue.</p>
      </div>
      <div className="button-container">
        <Link to="/login">
          <button className="auth-button login-button">Login</button>
        </Link>
        <Link to="/signup">
          <button className="auth-button signup-button">Signup</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
