require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5002,
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smartschool_db',
  },
  academicServiceUrl: process.env.ACADEMIC_SERVICE_URL || 'http://localhost:5003',
};
