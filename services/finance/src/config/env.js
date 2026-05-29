require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5004,
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smartschool_db',
  },
  studentServiceUrl: process.env.STUDENT_SERVICE_URL || 'http://localhost:5002',
  campay: {
    apiUrl: process.env.CAMPAY_API_URL || 'https://demo.campay.net/api',
    username: process.env.CAMPAY_USERNAME || '',
    password: process.env.CAMPAY_PASSWORD || '',
  }
};
