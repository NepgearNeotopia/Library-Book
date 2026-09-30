const express = require('express');
const users = require('../data/users');

const router = express.Router();

const VALID_ROLES = ['user', 'admin'];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// GET /api/users
router.get('/', (req, res) => {
  res.status(200).json(users);
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  const user = users.find((item) => item.id === Number(req.params.id));

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
});

// POST /api/users
router.post('/', (req, res) => {
  const { username, password, name, email, role } = req.body || {};

  const missing = [];
  if (!username || typeof username !== 'string' || username.trim() === '') missing.push('username');
  if (!password || typeof password !== 'string' || password.trim() === '') missing.push('password');
  if (!name || typeof name !== 'string' || name.trim() === '') missing.push('name');
  if (!email || typeof email !== 'string' || email.trim() === '') missing.push('email');
  if (!role) missing.push('role');

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
  }

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ message: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` });
  }

  if (!isValidEmail(email.trim())) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (users.some((user) => user.username.toLowerCase() === username.trim().toLowerCase())) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const nextId = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

  const newUser = {
    id: nextId,
    username: username.trim(),
    password,
    name: name.trim(),
    email: email.trim(),
    role
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

// PATCH /api/users/:id
router.patch('/:id', (req, res) => {
  const index = users.findIndex((user) => user.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { username, password, name, email, role } = req.body || {};

  if (role !== undefined && role !== null && role !== '' && !VALID_ROLES.includes(role)) {
    return res.status(400).json({ message: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` });
  }

  if (email !== undefined && email !== null && email !== '' && !isValidEmail(String(email).trim())) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (username !== undefined && username !== null && username !== '') {
    const nextUsername = String(username).trim();
    if (
      users.some(
        (user, i) => i !== index && user.username.toLowerCase() === nextUsername.toLowerCase()
      )
    ) {
      return res.status(400).json({ message: 'Username already exists' });
    }
  }

  if (username !== undefined) users[index].username = String(username).trim();
  if (password !== undefined) users[index].password = password;
  if (name !== undefined) users[index].name = String(name).trim();
  if (email !== undefined) users[index].email = String(email).trim();
  if (role !== undefined) users[index].role = role;

  res.status(200).json(users[index]);
});

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
  const index = users.findIndex((user) => user.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users.splice(index, 1);

  res.status(204).send();
});

module.exports = router;
