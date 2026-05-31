require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5003,
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'smartschool',
    password: process.env.DB_PASSWORD || 'smartpassword',
    database:
      process.env.ACADEMIC_DB_NAME || process.env.DB_NAME ||
      'smartschool_academic_db',
  },
  studentServiceUrl: process.env.STUDENT_SERVICE_URL || 'http://localhost:5002'
};
