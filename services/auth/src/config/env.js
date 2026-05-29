require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5001,
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smartschool_auth_db',
  },
  jwtSecret: process.env.JWT_SECRET || 'secret_par_defaut_smartschool_uy1',
};
