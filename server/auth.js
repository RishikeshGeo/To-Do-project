const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

//pass users array from data.js via dependency injection
function setupAuth(users) {
  // POST /user - Register
  const register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Username and password must be strings' });
    }

    if (users.find(u => u.username === username)) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`New user created: ${username} | Hashed password: ${hashedPassword}`);

    const newUser = { username, hashedPassword };
    users.push(newUser);

    res.status(201).json({ message: 'User created successfully', username });
  };

  // POST /login - Login & generate JWT
  const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    //comparing the hashed password with the entered password which is also hashed
    const match = await bcrypt.compare(password, user.hashedPassword);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    //if matched then create the jwt token which gives access to the protected methods.
    const token = jwt.sign(
      { username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  };

  return { register, login };
}

module.exports = setupAuth;
