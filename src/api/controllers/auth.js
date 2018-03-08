const passport = require('passport');
const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports.register = (req, res) => {
  const user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.setPassword(req.body.password);
  user.save((err) => {
    if (err) res.json(err);

    res.status(200);
    res.json({
      token: user.generateJwt(),
    });
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
