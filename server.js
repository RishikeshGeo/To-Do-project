const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const { todos, users } = require('./data.js');  // correct import (destructuring)

const app = express();

app.use(cors());
app.use(express.json());  // correct way — no need for { extended: false }

app.get("/", (req, res) => {
    res.status(200).json(todos);
});

app.post("/", (req, res) => {
    const newTodo = {
        message: req.body.message,
        id: uuidv4()
    };

    todos.push(newTodo);
    res.status(201).json(todos);
});

app.delete("/:id", (req, res) => {
    const { id } = req.params;
    const idx = todos.findIndex((t) => String(t.id) === String(id));

    if (idx === -1) {
        return res.status(404).json({ error: "Todo not found" });
    }

    todos.splice(idx, 1);
    return res.status(200).json(todos);
});

// ────────────────────────────────────────────────
// USER REGISTRATION ROUTE (POST /user)
// ────────────────────────────────────────────────
app.post('/user', async (req, res) => {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
        return res.status(400).json({ error: "Username and Password are required" });
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: "Username and Password must be strings" });
    }

    // Check for duplicate usernames
    if (users.find(u => u.username === username)) {
        return res.status(409).json({ error: "Username already exists" });
    }

    // Hash the password (10 salt rounds is standard)
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`new user created: ${username} with hashed password: ${hashedPassword}`);

    // Create and store user (never store plain password!)
    const newUser = { username, hashedPassword };
    users.push(newUser);

    // Success response
    res.status(201).json({ message: 'User created successfully', username });
});

// ────────────────────────────────────────────────
// Only listen if this file is run directly
if (require.main === module) {
    const PORT = 5001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;