import { useState, useEffect } from 'react';
import axios from 'axios';
import Todos from './components/todos';
import Preloader from './components/preloader';
import Header from './components/header';
import Input from './components/todoinput';
import LoginForm from './components/loginform';
import './App.css';


function App() {
  const [todos, setTodos] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch todos when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const getTodos = async () => {
        const res = await axios.get("http://localhost:5001");
        setTodos(res.data);
      };
      getTodos();
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setTodos(null);
  };

  const createTodo = async (text) => {
    const token = localStorage.getItem('token');
    
    const res = await axios.post('http://localhost:5001', 
      {message: text},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    setTodos(res.data);
  };

  const removeTodo = async (id) => {
    setTodos((prev) => (prev ? prev.filter((t) => String(t.id) !== String(id)) : prev));

    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:5001/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (e) {
      const res = await axios.get("http://localhost:5001");
      setTodos(res.data);
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  // Show todo app if authenticated
  return (
    <div className="App"> 
      <div className="container">
        <Header />
        <button onClick={handleLogout} className="logout-btn">Logout</button>
        <h3>click "Add a task" to add a task, click on the task to remove it.</h3>
        <Input onAdd={createTodo} />
        {todos ? <Todos todos={todos} onRemove={removeTodo} /> : <Preloader />}
      </div>
    </div>
  );
}

export default App;