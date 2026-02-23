import { useState, useEffect } from 'react';
import axios from 'axios';
import Todos from './components/todos';
import Preloader from './components/preloader';
import Header from './components/header';
import Input from './components/todoinput';
import LoginForm from './components/loginform';
import Sidebar from './components/sidebar';
import History from './components/history';
import { API_BASE } from './api';
import './App.css';

function App() {
  const [todos, setTodos] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch profile (/me) when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem('token');
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          handleLogout();
        }
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  // Fetch todos when authenticated (user-specific list)
  useEffect(() => {
    if (!isAuthenticated) return;

    const getTodos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(API_BASE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          handleLogout();
        }
      }
    };
    getTodos();
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setTodos(null);
    setUser(null);
  };

  const createTodo = async (text) => {
    const token = localStorage.getItem('token');
    const res = await axios.post(
      API_BASE,
      { message: text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTodos(res.data);
  };

  const removeTodo = async (id) => {
    setTodos((prev) => (prev ? prev.filter((t) => String(t.id) !== String(id)) : prev));
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    } catch (e) {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    }
  };

  const editTodo = async (id, message) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        `${API_BASE}/${id}`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(res.data);
    } catch (e) {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  // Show todo app with sidebar
  const token = localStorage.getItem('token');
  return (
    <div className="App">
      <Sidebar user={user} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="app-main">
        <div className="container">
          <Header />
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
          {activeTab === 'home' && (
            <>
              <p className="heading-subtext">Add a task below. Use ✏️ to edit or 🗑️ to remove a task.</p>
              <Input onAdd={createTodo} />
              {todos ? (
                <Todos todos={todos} onRemove={removeTodo} onEdit={editTodo} />
              ) : (
                <Preloader />
              )}
            </>
          )}
          {activeTab === 'history' && <History token={token} />}
        </div>
      </div>
    </div>
  );
}

export default App;
