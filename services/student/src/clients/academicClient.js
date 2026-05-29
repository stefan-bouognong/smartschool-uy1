const axios = require('axios');
const config = require('../config/env');

const academicClient = axios.create({
  baseURL: config.academicServiceUrl,
  timeout: 3000, // Timeout de 3 secondes pour la validation académique
  headers: {
    'Content-Type': 'application/json',
    'X-Internal-Service-Name': 'Student-Service'
  }
});

module.exports = academicClient;
