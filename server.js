const express = require('express');
const cors = require('cors')
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors())

//post request middleware-
app.use(express.json({ extended: false })) //allows us to read that data we try to post.

const todos = [
    {
        message: "wash car",
        id: 1
    },
    {
        message: "play tennis",
        id: 2
    },
    {
        message: "make project",
        id: 3
    }
]

app.get("/", (req,res) => {
    res.status(200).json(todos);
});

app.post("/", (req,res) => {
    const newTodo = {
        message: req.body.message,
        id: uuidv4()
    }

    todos.push(newTodo)
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

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});