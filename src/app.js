const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/auth', require('./modules/auth/auth.routes'));
// Route test
app.get('/', (req, res) => {
  res.json({ message: 'SmartSchool API running' });
});

module.exports = app;