/** @module AuthenticationController */
const passport = require('passport');
const User = require('../models/users');

/**
 * Route for registering new user.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @param {req.body} user - The information of the new user.
 * @returns {object} - Message that new user is created.
 */
module.exports.register = (req, res) => {
  const user = new User.Model();
  user.username = req.body.username;
  user.email = req.body.email;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.setPassword(req.body.password);
  user.save((err) => {
    if (err) res.json(err);

    res.status(200).json(`user ${user.username} registered`);
  });
};

/**
 * Route for logging in user using Passport.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @returns {object} - JWT token.
 */
module.exports.login = (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if (user) {
      res.status(200);
      res.json({
        token: user.generateJwt(),
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);
};

/**
 * Route for authorizing profile viewing.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @param {req.payload} _id - The id of the user.
 * @returns {object} - Information of the user.
 */
module.exports.profileRead = (req, res) => {
  if (!req.payload._id) {
    res.status(401).json({
      message: 'UnauthorizedError: private profile',
    });
  } else {
    User.Model.findById(req.payload._id).exec((err, user) => {
      if (err) res.json(err);
      else res.status(200).json(user);
    });
  }
};

/**
 * Route for checking if username is taken.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @param {req.params} id - The username attempting to be registerd.
 * @returns {boolean} - Whether username is found or not.
 */
module.exports.validateUsername = (req, res) => {
  const jsonData = {
    found: false,
  };
  User.Model.findOne({
    username: req.params.id,
  }, (err, customer) => {
    if (!customer) jsonData.found = false;
    else jsonData.found = true;
    res.json(jsonData);
  });
};

/**
 * Route for checking if email is taken.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @param {req.params} id - The email attempting to be registerd.
 * @returns {boolean} - Whether email is found or not.
 */
module.exports.validateEmail = (req, res) => {
  // Retrun data if email is found
  const jsonData = {
    found: false,
  };
  // Customer database query on passed email
  User.Model.findOne({
    email: req.params.id,
  }, (err, customer) => {
    if (!customer) jsonData.found = false;
    else jsonData.found = true;
    res.json(jsonData);
  });
};
