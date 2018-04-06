const passport = require('passport');
const User = require('../models/users');

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

/* Checks if username is taken */
module.exports.validateUsername = (req, res) => {
  // Retrun data if username is found
  const jsonData = {
    found: false,
  };
  // Customer database query on passed id
  User.Model.findOne({
    username: req.params.id,
  }, (err, customer) => {
    if (!customer) jsonData.found = false;
    else jsonData.found = true;
    res.json(jsonData);
  });
};

/* Checks if email is taken */
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
