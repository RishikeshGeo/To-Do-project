import { useState, useEffect } from 'react';
import axios from 'axios'
import Todos from './components/todos';
import Preloader from './components/preloader';
import Header from './components/header';
import Input from './components/todoinput';
import './App.css';


function App() {

  const[todos, setTodos] = useState(null)

  useEffect(() => {
    const getTodos = async () => {
      const res = await axios.get("http://localhost:5001")
      setTodos(res.data)
    }

    getTodos();
  }, [])


  const createTodo = async (text) => {
    const res = await axios.post('http://localhost:5001', {message: text})
    setTodos(res.data)

  }

  const removeTodo = async (id) => {
    setTodos((prev) => (prev ? prev.filter((t) => String(t.id) !== String(id)) : prev));

    try {
      await axios.delete(`http://localhost:5001/${id}`);
    } catch (e) {
      const res = await axios.get("http://localhost:5001");
      setTodos(res.data);
    }
  };

  return (
    <div className="App"> 
      <div className="container">
          <Header />
          <h3>click "Add a task" to add a task, click on the task to remove it.</h3>
          <Input onAdd={createTodo} />
          {todos ? <Todos todos={todos} onRemove={removeTodo} /> : <Preloader />}
      </div>
      
    </div>
  );
}

export default App;
