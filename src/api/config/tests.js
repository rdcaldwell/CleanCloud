require('dotenv').config();
require('./passport');
require('express-jwt')({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload',
});
