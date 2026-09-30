const express = require('express');
const books = require('../data/books');

const router = express.Router();

const VALID_TYPES = ['textbook', 'comic'];
const VALID_CATEGORIES = ['science', 'math', 'thai', 'fantasy', 'romantic', 'mystery'];
const VALID_STATUSES = ['available', 'borrowed'];
const DEFAULT_COVER = '/assets/images/book-placeholder.jpg';

function findIndexById(id) {
  return books.findIndex((book) => book.id === Number(id));
}

// GET /api/books?type=&category=&status=
router.get('/', (req, res) => {
  const { type, category, status } = req.query;

  let result = books;

  if (type !== undefined) {
    result = result.filter((book) => book.type === type);
  }
  if (category !== undefined) {
    result = result.filter((book) => book.category === category);
  }
  if (status !== undefined) {
    result = result.filter((book) => book.status === status);
  }

  res.status(200).json(result);
});

// GET /api/books/:id
router.get('/:id', (req, res) => {
  const book = books.find((item) => item.id === Number(req.params.id));

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.status(200).json(book);
});

// POST /api/books
router.post('/', (req, res) => {
  const { title, author, type, category, description, coverImage, status, quantity } = req.body || {};

  const missing = [];
  if (!title || typeof title !== 'string' || title.trim() === '') missing.push('title');
  if (!author || typeof author !== 'string' || author.trim() === '') missing.push('author');
  if (!type) missing.push('type');
  if (!category) missing.push('category');

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
  }

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ message: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` });
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({
      message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`
    });
  }

  if (status !== undefined && status !== null && status !== '' && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  const nextId = books.length > 0 ? Math.max(...books.map((book) => book.id)) + 1 : 1;

  const newBook = {
    id: nextId,
    title: title.trim(),
    author: author.trim(),
    type,
    category,
    description: description || '',
    coverImage: coverImage || DEFAULT_COVER,
    status: status || 'available',
    quantity: Number.isInteger(quantity) && quantity >= 0 ? quantity : 1
  };

  books.push(newBook);

  res.status(201).json(newBook);
});

// PATCH /api/books/:id
router.patch('/:id', (req, res) => {
  const index = findIndexById(req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const { title, author, type, category, description, coverImage, status, quantity } = req.body || {};

  if (type !== undefined && !VALID_TYPES.includes(type)) {
    return res.status(400).json({ message: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` });
  }

  if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({
      message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`
    });
  }

  if (status !== undefined && status !== null && status !== '' && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
    return res.status(400).json({ message: 'quantity must be a non-negative integer' });
  }

  if (title !== undefined) books[index].title = title;
  if (author !== undefined) books[index].author = author;
  if (type !== undefined) books[index].type = type;
  if (category !== undefined) books[index].category = category;
  if (description !== undefined) books[index].description = description;
  if (coverImage !== undefined) books[index].coverImage = coverImage;
  if (status !== undefined) books[index].status = status;
  if (quantity !== undefined) books[index].quantity = quantity;

  res.status(200).json(books[index]);
});

// DELETE /api/books/:id
router.delete('/:id', (req, res) => {
  const index = findIndexById(req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books.splice(index, 1);

  res.status(204).send();
});

module.exports = router;
