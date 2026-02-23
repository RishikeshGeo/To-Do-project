const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

function setupAuth() {
  // POST /user - Register
  const register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Username and password must be strings' });
    }

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ error: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(`New user created: ${username}`);

      // Create user in database
      await User.create({ username, hashedPassword });

      res.status(201).json({ message: 'User created successfully', username });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Server error during registration' });
    }
  };

  // POST /login - Login & generate JWT
  const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    try {
      // Find user in database
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Compare password
      const match = await bcrypt.compare(password, user.hashedPassword);
      if (!match) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Generate JWT
      const token = jwt.sign(
        { username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error during login' });
    }
  };

  return { register, login };
}

module.exports = setupAuth;