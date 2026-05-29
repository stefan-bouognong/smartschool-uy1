require("dotenv").config();

module.exports = {
  port: process.env.PORT || 8000,
  jwtSecret: process.env.JWT_SECRET || "secret_par_defaut_smartschool_uy1",
  services: {
    auth: process.env.AUTH_SERVICE_URL || "http://localhost:5001",
    scolarite: process.env.SCOLARITE_SERVICE_URL || "http://localhost:5002",
    academique: process.env.ACADEMIC_SERVICE_URL || "http://localhost:5003",
    finance: process.env.FINANCE_SERVICE_URL || "http://localhost:5004",
    reporting: process.env.REPORTING_SERVICE_URL || "http://localhost:5005",
    admin: process.env.ADMIN_SERVICE_URL || "http://localhost:5006",
  },
};
