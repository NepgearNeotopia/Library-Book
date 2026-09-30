const express = require('express');
const books = require('../data/books');
const users = require('../data/users');
const borrowings = require('../data/borrowings');

const router = express.Router();

const VALID_STATUSES = ['borrowed', 'returned'];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// GET /api/borrowings?userId=&bookId=&status=
router.get('/', (req, res) => {
  const { userId, bookId, status } = req.query;

  let result = borrowings;

  if (userId !== undefined) {
    result = result.filter((item) => item.userId === Number(userId));
  }
  if (bookId !== undefined) {
    result = result.filter((item) => item.bookId === Number(bookId));
  }
  if (status !== undefined) {
    result = result.filter((item) => item.status === status);
  }

  res.status(200).json(result);
});

// GET /api/borrowings/:id
router.get('/:id', (req, res) => {
  const borrowing = borrowings.find((item) => item.id === Number(req.params.id));

  if (!borrowing) {
    return res.status(404).json({ message: 'Borrowing not found' });
  }

  res.status(200).json(borrowing);
});

// POST /api/borrowings
router.post('/', (req, res) => {
  const { userId, bookId, dueDate } = req.body || {};

  if (userId === undefined || userId === null || userId === '') {
    return res.status(400).json({ message: 'Missing required field: userId' });
  }
  if (bookId === undefined || bookId === null || bookId === '') {
    return res.status(400).json({ message: 'Missing required field: bookId' });
  }

  const user = users.find((item) => item.id === Number(userId));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const book = books.find((item) => item.id === Number(bookId));
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (book.status !== 'available') {
    return res.status(400).json({ message: 'Book is already borrowed' });
  }

  const borrowDate = today();
  const nextId = borrowings.length > 0 ? Math.max(...borrowings.map((item) => item.id)) + 1 : 1;

  const newBorrowing = {
    id: nextId,
    userId: user.id,
    bookId: book.id,
    borrowDate,
    dueDate: dueDate || addDays(borrowDate, 14),
    returnDate: null,
    status: 'borrowed'
  };

  borrowings.push(newBorrowing);
  book.status = 'borrowed';

  res.status(201).json(newBorrowing);
});

// PATCH /api/borrowings/:id
router.patch('/:id', (req, res) => {
  const index = borrowings.findIndex((item) => item.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: 'Borrowing not found' });
  }

  const { userId, bookId, dueDate, status } = req.body || {};

  if (status !== undefined && status !== null && status !== '' && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  if (userId !== undefined) {
    const user = users.find((item) => item.id === Number(userId));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  }

  if (bookId !== undefined) {
    const book = books.find((item) => item.id === Number(bookId));
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
  }

  if (userId !== undefined) borrowings[index].userId = Number(userId);
  if (bookId !== undefined) borrowings[index].bookId = Number(bookId);
  if (dueDate !== undefined) borrowings[index].dueDate = dueDate;

  if (status !== undefined && status !== null && status !== '') {
    borrowings[index].status = status;

    if (status === 'returned' && borrowings[index].returnDate === null) {
      borrowings[index].returnDate = today();
    }

    const book = books.find((item) => item.id === borrowings[index].bookId);
    if (book) {
      book.status = status === 'returned' ? 'available' : 'borrowed';
    }
  }

  res.status(200).json(borrowings[index]);
});

// DELETE /api/borrowings/:id
router.delete('/:id', (req, res) => {
  const index = borrowings.findIndex((item) => item.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: 'Borrowing not found' });
  }

  const borrowing = borrowings[index];

  if (borrowing.status === 'borrowed') {
    const book = books.find((item) => item.id === borrowing.bookId);
    if (book) {
      book.status = 'available';
    }
  }

  borrowings.splice(index, 1);

  res.status(204).send();
});

module.exports = router;
