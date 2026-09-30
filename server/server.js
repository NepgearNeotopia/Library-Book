const path = require('path');
const express = require('express');
const cors = require('cors');

const booksRouter = require('./routes/books');
const usersRouter = require('./routes/users');
const borrowingsRouter = require('./routes/borrowings');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicDir = path.join(__dirname, '..', 'public');

app.use(express.static(publicDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.use('/api/books', booksRouter);
app.use('/api/users', usersRouter);
app.use('/api/borrowings', borrowingsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Library Book Borrowing System API' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
