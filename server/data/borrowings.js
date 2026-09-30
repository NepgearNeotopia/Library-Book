const borrowings = [
  {
    id: 1,
    userId: 2,
    bookId: 3,
    borrowDate: '2026-09-01',
    dueDate: '2026-09-15',
    returnDate: null,
    status: 'borrowed'
  },
  {
    id: 2,
    userId: 3,
    bookId: 6,
    borrowDate: '2026-09-03',
    dueDate: '2026-09-17',
    returnDate: null,
    status: 'borrowed'
  },
  {
    id: 3,
    userId: 4,
    bookId: 13,
    borrowDate: '2026-08-20',
    dueDate: '2026-09-03',
    returnDate: '2026-09-02',
    status: 'returned'
  },
  {
    id: 4,
    userId: 5,
    bookId: 23,
    borrowDate: '2026-08-25',
    dueDate: '2026-09-08',
    returnDate: '2026-09-07',
    status: 'returned'
  },
  {
    id: 5,
    userId: 6,
    bookId: 33,
    borrowDate: '2026-09-10',
    dueDate: '2026-09-24',
    returnDate: null,
    status: 'borrowed'
  }
];

module.exports = borrowings;
