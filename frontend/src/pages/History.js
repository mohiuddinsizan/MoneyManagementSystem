import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/users/transaction-history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTransactions(response.data.transactionHistory);
      } catch (err) {
        setError("Failed to load transaction history.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, [navigate]);

  if (loading) return <p className="loading-text">Loading transactions...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="history-container">
      <h2>Transaction History</h2>
      <ul>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <li key={index}>
              <strong>{transaction.type === "debt" ? "Debt" : "Credit"}</strong> - {transaction.name}: ${transaction.amount} on {new Date(transaction.timestamp).toLocaleString()}
            </li>
          ))
        ) : (
          <p>No transactions available.</p>
        )}
      </ul>

      {/* Profile Navigation Button */}
      <button
        className="navigate-btn"
        onClick={() => navigate("/profile")}
      >
        Go to Profile
      </button>
    </div>
  );
};

export default History;
