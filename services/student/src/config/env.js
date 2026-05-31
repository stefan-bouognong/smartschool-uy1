require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5002,
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'smartschool',
    password: process.env.DB_PASSWORD || 'smartpassword',
    database:
      process.env.STUDENT_DB_NAME || process.env.DB_NAME ||
      'smartschool_student_db',
  },
  academicServiceUrl: process.env.ACADEMIC_SERVICE_URL || 'http://localhost:5003',
};
