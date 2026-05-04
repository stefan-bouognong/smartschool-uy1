const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const financeRoutes = require('./modules/finance/finance.routes');

const app = express();

const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/finance', financeRoutes);

// Route test
app.get('/', (req, res) => {
  res.json({ message: 'SmartSchool API running' });
});

module.exports = app;