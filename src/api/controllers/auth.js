/** @module AuthenticationController */
const config = require('../config/config');
const jwt = require('jwt-simple');
const LdapAuth = require('ldapauth-fork');
const log = require('log4js').getLogger('auth');
const moment = require('moment');

log.level = 'info';

const options = {
  url: config.ldapUrl,
  bindDN: config.bindDn,
  bindCredentials: process.env.BIND_CREDENTIALS,
  searchBase: config.searchBase,
  searchFilter: '(uid={{username}})',
};
const ldap = new LdapAuth(options);

ldap.on('error', (err) => {
  log.error('LdapAuth: ', err);
});


const generateJwt = user => jwt.encode({
  exp: parseInt(moment().add(2, 'days').format('X')),
  username: user.uid,
}, process.env.JWT_SECRET);

/**
 * Route for logging in user using Passport.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @returns {object} - JWT token.
 */
module.exports.login = (req, res) => {
  ldap.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err) {
      res.status(401).json(err.lde_message);
      return;
    }

    if (user) {
      res.status(200).json({
        token: generateJwt(user),
      });
    }
  });
};

/**
 * Route for authorizing profile viewing.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @param {req.payload} username - The username of the user.
 * @returns {object} - Information of the user.
 */
module.exports.profileRead = (req, res) => {
  if (!req.payload.username) {
    res.status(401).json({
      message: 'UnauthorizedError: private profile',
    });
  } else {
    ldap._findUser(req.payload.username, (err, user) => {
      if (err) res.json(err);
      else {
        res.status(200).json(user);
      }
    });
  }
};
