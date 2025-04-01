import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile"; // Import Profile
import "./index.css";
import "./pages/MoneyFeed"
import History from "./pages/History";
import MoneyFeed from "./pages/MoneyFeed";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/history" element={<History />} />
    <Route path="/moneyfeed" element={<MoneyFeed />} />
    </Routes>
  </Router>
);
