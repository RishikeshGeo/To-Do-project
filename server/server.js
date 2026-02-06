const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { todos, users } = require('./data');
const setupAuth = require('./auth');
const authenticate = require('./middleware/authMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize auth handlers
const { register, login } = setupAuth(users);

// ────────────────────────────────────────────────
// Protected routes – require valid JWT token
// ────────────────────────────────────────────────
// GET / – return only the authenticated user's todos
app.get('/', authenticate, (req, res) => {
  const userTodos = todos.filter((t) => t.userId === req.user.username);
  res.status(200).json(userTodos);
});

// ────────────────────────────────────────────────
// Auth routes (registration & login)
// ────────────────────────────────────────────────
app.post('/user', register);
app.post('/login', login);

app.post('/', authenticate, (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required and must be a string' });
  }

  const newTodo = {
    message,
    id: uuidv4(),
    userId: req.user.username,
  };

  todos.push(newTodo);
  const userTodos = todos.filter((t) => t.userId === req.user.username);
  res.status(201).json(userTodos);
});

app.delete('/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const username = req.user.username;

  const index = todos.findIndex(
    (todo) => String(todo.id) === String(id) && todo.userId === username
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos.splice(index, 1);
  const userTodos = todos.filter((t) => t.userId === username);
  res.status(200).json(userTodos);
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
