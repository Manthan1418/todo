const express = require('express');
const router = express.Router();

// Mock todo database
const todos = [];

// Get all todos for current user
router.get('/', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    const userTodos = todos.filter(todo => todo.userId === req.session.user.id);
    res.json(userTodos);
});

// Add new todo
router.post('/', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Todo text is required' });
    }
    const newTodo = {
        id: Date.now().toString(),
        userId: req.session.user.id,
        text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// Delete todo
router.patch('/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    const todo = todos.find(t => 
        t.id === req.params.id &&
        t.userId === req.session.user.id
    );
    if (todo) {
        todo.completed = req.body.completed;
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

router.delete('/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    const index = todos.findIndex(todo => 
        todo.id === req.params.id && 
        todo.userId === req.session.user.id
    );
    if (index === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    todos.splice(index, 1);
    res.json({ message: 'Todo deleted successfully' });
});

module.exports = router;
