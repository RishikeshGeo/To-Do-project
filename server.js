const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { todos, users } = require('./data.js');
const setupAuth = require('./auth.js');
const authenticate = require('./authMiddleware.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize auth handlers
const { register, login } = setupAuth(users);

// ────────────────────────────────────────────────
// Public routes (no auth needed)
// ────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json(todos);
});

// ────────────────────────────────────────────────
// Auth routes (registration & login)
// ────────────────────────────────────────────────
app.post('/user', register);
app.post('/login', login);

// ────────────────────────────────────────────────
// Protected routes – require valid JWT token
// ────────────────────────────────────────────────
app.post('/', authenticate, (req, res) => {
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

app.delete('/:id', authenticate, (req, res) => {
  const { id } = req.params;

  const index = todos.findIndex((todo) => String(todo.id) === String(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos.splice(index, 1);
  res.status(200).json(todos);
});

// ────────────────────────────────────────────────
// Start server only when run directly
// ────────────────────────────────────────────────
if (require.main === module) {
  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;