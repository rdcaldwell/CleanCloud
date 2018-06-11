require('dotenv').config();
require('express-jwt')({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload',
});
