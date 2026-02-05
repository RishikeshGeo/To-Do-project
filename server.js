const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const { todos, users } = require('./data.js');

const setupAuth = require('./auth.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize auth handlers with users array
const { register, login } = setupAuth(users);

// ────────────────────────────────────────────────
// GET / - Fetch all todos (public for now)
// ────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json(todos);
});

// ────────────────────────────────────────────────
// POST / - Add a new todo
// ────────────────────────────────────────────────
app.post('/', (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required and must be a string' });
  }

  const newTodo = {
    message,
    id: uuidv4(),
  };

  todos.push(newTodo);
  res.status(201).json(todos);
});

// ────────────────────────────────────────────────
// DELETE /:id - Remove a todo by ID
// ────────────────────────────────────────────────
app.delete('/:id', (req, res) => {
  const { id } = req.params;

  const index = todos.findIndex((todo) => String(todo.id) === String(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos.splice(index, 1);
  res.status(200).json(todos);
});

// ────────────────────────────────────────────────
// Auth routes
// ────────────────────────────────────────────────
app.post('/user', register);
app.post('/login', login);

// ────────────────────────────────────────────────
// Start server only if this file is run directly
// ────────────────────────────────────────────────
if (require.main === module) {
  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;