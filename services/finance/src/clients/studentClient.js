const axios = require('axios');
const config = require('../config/env');

const studentClient = axios.create({
  baseURL: config.studentServiceUrl,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
    'X-Internal-Service-Name': 'Finance-Service'
  }
});

module.exports = studentClient;
