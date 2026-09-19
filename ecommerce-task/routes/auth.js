const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('node:path');
const { readData, writeData } = require('../utils/fileDB');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const usersPath = path.join(__dirname, '../data/users.json');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'username and password are required' });
    }

    const users = await readData(usersPath);

    const existingUser = users.find((u) => u.username === username);

    if (existingUser) {
        return res.status(400).json({ error: 'username already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        username,
        passwordHash,
        role: 'customer',
    };

    users.push(newUser);

    await writeData(usersPath, users);

    res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
    });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const users = await readData(usersPath);

    const user = users.find((u) => u.username === username);

    if (!user) {
        return res.status(401).json({ error: 'invalid username or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
        return res.status(401).json({ error: 'invalid username or password' });
    }

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: '2h' }
    );

    res.status(200).json({ token });
});

module.exports = router;
