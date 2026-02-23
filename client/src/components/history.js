import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './history.css';

const API_BASE = 'http://localhost:5001';

const History = ({ token }) => {
  const [history, setHistory] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load history');
      }
    };
    fetchHistory();
  }, [token]);

  if (error) return <p className="history-error">{error}</p>;
  if (history === null) return <p className="history-loading">Loading history…</p>;

  const list = history.length === 0
    ? <p className="history-empty">No deleted tasks yet.</p>
    : (
        <ul className="history-list">
          {history.map((item, index) => (
            <li key={item._id || index} className="history-item">
              <span className="history-message">{item.message}</span>
              <span className="history-date">
                {item.deletedAt
                  ? new Date(item.deletedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : ''}
              </span>
            </li>
          ))}
        </ul>
      );

  return (
    <div className="history">
      <h2 className="history-heading">Recently removed (last 5)</h2>
      {list}
    </div>
  );
};

export default History;
