const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const setupAuth = require('./auth.js');
const authenticate = require('./middleware/authMiddleware');
const connectDB = require('./config/db');
const Todo = require('./models/todo');
const TodoHistory = require('./models/todoHistory');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize auth handlers
const { register, login } = setupAuth();

// ────────────────────────────────────────────────
// Protected routes – require valid JWT token
// ────────────────────────────────────────────────
app.get('/me', authenticate, (req, res) => {
  res.status(200).json({ username: req.user.username, _id: req.user._id });
});

app.get('/', authenticate, async (req, res) => {
  try {
    // Get only the authenticated user's todos
    const todos = await Todo.find({ userId: req.user._id });
    res.status(200).json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Server error fetching todos' });
  }
});

// ────────────────────────────────────────────────
// Auth routes (registration & login)
// ────────────────────────────────────────────────
app.post('/user', register);
app.post('/login', login);

// ────────────────────────────────────────────────
// Protected routes – require valid JWT token
// ────────────────────────────────────────────────
app.post('/', authenticate, async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required and must be a string' });
  }

  try {
    const newTodo = await Todo.create({
      id: uuidv4(),
      message,
      userId: req.user._id  // Link to authenticated user
    });

    // Return all user's todos
    const todos = await Todo.find({ userId: req.user._id });
    res.status(201).json(todos);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Server error creating todo' });
  }
});

app.get('/history', authenticate, async (req, res) => {
  try {
    const history = await TodoHistory.find({ userId: req.user._id })
      .sort({ deletedAt: -1 })
      .limit(5)
      .lean();
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Server error fetching history' });
  }
});

app.patch('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required and must be a string' });
  }

  try {
    const todo = await Todo.findOneAndUpdate(
      { id, userId: req.user._id },
      { message },
      { new: true }
    );
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found or unauthorized' });
    }
    const todos = await Todo.find({ userId: req.user._id });
    res.status(200).json(todos);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Server error updating todo' });
  }
});

app.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findOne({ id, userId: req.user._id });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found or unauthorized' });
    }
    await TodoHistory.create({ message: todo.message, userId: req.user._id });
    const historyCount = await TodoHistory.countDocuments({ userId: req.user._id });
    if (historyCount > 5) {
      const oldest = await TodoHistory.find({ userId: req.user._id })
        .sort({ deletedAt: 1 })
        .limit(historyCount - 5)
        .select('_id');
      await TodoHistory.deleteMany({ _id: { $in: oldest.map((d) => d._id) } });
    }
    await Todo.deleteOne({ id, userId: req.user._id });
    const todos = await Todo.find({ userId: req.user._id });
    res.status(200).json(todos);
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Server error deleting todo' });
  }
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