const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'auto-delivery-jwt-secret-2024',
  jwtExpiresIn: '7d',
  uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads'),
  dbPath: process.env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'app.db'),
  corsOrigin: process.env.CORS_ORIGIN || '*'
};
