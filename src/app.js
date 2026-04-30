const express = require('express');
const app = express();

app.use(express.json());

// test endpoint
app.get('/', (req, res) => {
  res.json({ message: "SmartSchool API running" });
});

module.exports = app;