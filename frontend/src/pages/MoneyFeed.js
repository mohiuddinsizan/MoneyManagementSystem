import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MoneyFeed.css";

const MoneyFeed = () => {
  const [debts, setDebts] = useState([]);
  const [owedByOthers, setOwedByOthers] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("debt");
  const [editId, setEditId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // For confirmation modal
  const [deleteEntryId, setDeleteEntryId] = useState(null);
  const [deleteType, setDeleteType] = useState("");
  const navigate = useNavigate();

  const fetchMoneyFeed = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDebts(response.data.debts || []);
      setOwedByOthers(response.data.owedByOthers || []);
    } catch (err) {
      setNotification({ message: "Error fetching data.", type: "error" });
      console.error("Error fetching money feed:", err);
    }
  };

  useEffect(() => {
    fetchMoneyFeed();
  }, []);

  const handleAddOrUpdateEntry = async () => {
    if (!name || !amount) {
      setNotification({ message: "Please enter both name and amount.", type: "error" });
      return;
    }

    const entry = { name, amount: parseFloat(amount) };
    const token = localStorage.getItem("token");

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/users/update-${type}/${editId}`, entry, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotification({ message: "Entry updated successfully!", type: "success" });
      } else {
        await axios.post(`http://localhost:5000/api/users/add-${type}`, entry, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotification({ message: "Entry added successfully!", type: "success" });
      }

      fetchMoneyFeed();
      setName("");
      setAmount("");
      setEditId(null);
    } catch (err) {
      setNotification({ message: "Failed to process the request.", type: "error" });
      console.error("Error:", err.response ? err.response.data : err);
    }
  };

  const handleEditEntry = (entry, type) => {
    setName(entry.name);
    setAmount(entry.amount);
    setType(type);
    setEditId(entry._id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    navigate("/login"); // Redirect to login
  };

  const handleDeleteEntry = (id, type) => {
    setDeleteEntryId(id);
    setDeleteType(type);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/delete-${deleteType}/${deleteEntryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotification({ message: "Entry deleted successfully!", type: "success" });
      fetchMoneyFeed();
      setShowDeleteConfirm(false); // Close the modal after deleting
    } catch (err) {
      setNotification({ message: "Failed to delete entry.", type: "error" });
      console.error("Error deleting entry:", err.response ? err.response.data : err);
      setShowDeleteConfirm(false); // Close the modal on failure
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false); // Close the modal without deleting
  };

  const renderEntries = (entries, type) => {
    const groupedEntries = entries.reduce((acc, entry) => {
      acc[entry.name] = acc[entry.name] || [];
      acc[entry.name].push(entry);
      return acc;
    }, {});

    return Object.keys(groupedEntries).map((name, index) => (
      <div className={`entry-box ${type}`} key={index}>
        <h3>{name}</h3>
        {groupedEntries[name].map((entry) => (
          <div key={entry._id} className="entry-item">
            <span>${entry.amount}</span>
            <button className="edit-btn" onClick={() => handleEditEntry(entry, type)}>Edit</button>
            <button className="delete-btn" onClick={() => handleDeleteEntry(entry._id, type)}>Delete</button>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="moneyfeed-container">
      <div className="moneyfeed-box"> 
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="delete-modal">
            <div className="delete-modal-content">
              <h3>Are you sure you want to delete this entry?</h3>
              <button className="confirm-delete" onClick={confirmDelete}>Yes, delete</button>
              <button className="cancel-delete" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        )}

        <div className="columns">
          <div className="column">
            <h3>I Owe (Debt)</h3>
            {debts.length > 0 ? renderEntries(debts, "debt") : <p>No debts recorded.</p>}
          </div>

          <div className="column">
            <h3>They Owe (Credit)</h3>
            {owedByOthers.length > 0 ? renderEntries(owedByOthers, "owed") : <p>No one owes you money.</p>}
          </div>
        </div>

        <div className="add-entry">
          <i><h2 className="add-entry-text">{editId ? "Edit Entry" : "Add New Entry"}</h2></i>
          <input type="text" className="add-entry-name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="number" className="add-entry-name" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="debt">Debt</option>
            <option value="owed">Credit</option>
          </select>
          <button onClick={handleAddOrUpdateEntry}>{editId ? "Update" : "Add"}</button>
        </div>

        <button className="navigate-btn" onClick={() => navigate("/profile")}>
          Back to Profile
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default MoneyFeed;
