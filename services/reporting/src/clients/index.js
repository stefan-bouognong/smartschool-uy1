const axios = require('axios');
const config = require('../config/env');

const studentClient = axios.create({
  baseURL: config.studentServiceUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-Internal-Service-Name': 'Reporting-Service'
  }
});

const academicClient = axios.create({
  baseURL: config.academicServiceUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-Internal-Service-Name': 'Reporting-Service'
  }
});

const financeClient = axios.create({
  baseURL: config.financeServiceUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-Internal-Service-Name': 'Reporting-Service'
  }
});

module.exports = {
  studentClient,
  academicClient,
  financeClient
};
