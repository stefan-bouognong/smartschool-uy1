require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5005,
  studentServiceUrl: process.env.STUDENT_SERVICE_URL || 'http://localhost:5002',
  academicServiceUrl: process.env.ACADEMIC_SERVICE_URL || 'http://localhost:5003',
  financeServiceUrl: process.env.FINANCE_SERVICE_URL || 'http://localhost:5004',
};
