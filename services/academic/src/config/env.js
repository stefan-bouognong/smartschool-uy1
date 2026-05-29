require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5003,
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smartschool_db',
  }
};
