require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8000,
  jwtSecret: process.env.JWT_SECRET || 'secret_par_defaut_smartschool_uy1',
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:5000',
    students: process.env.STUDENT_SERVICE_URL || 'http://localhost:5000',
    academic: process.env.ACADEMIC_SERVICE_URL || 'http://localhost:5000',
    finance: process.env.FINANCE_SERVICE_URL || 'http://localhost:5000',
    reporting: process.env.REPORTING_SERVICE_URL || 'http://localhost:5000'
  }
};
