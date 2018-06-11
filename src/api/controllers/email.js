/** @module EmailController */
/* eslint no-unused-vars: 0 */
const config = require('../config/config');
const log = require('log4js').getLogger('email');
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: config.smtpServer,
  port: config.smtpPort,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

log.level = 'info';

/**
 * Sends email to resource owner.
 * @param {string} clusterName - The name of the cluster.
 * @param {string} startedBy - The initials of the resource owner.
 * @param {string} message - The message for the resource owner.
 */
module.exports.emailStartedBy = (clusterName, startedBy, message) => {
  log.info(`Building email for ${startedBy}`);
  // setup email data with unicode symbols
  const mailOptions = {
    from: `"CleanCloud" <${process.env.EMAIL_ADDRESS}>`,
    to: `${startedBy}@fischerinternational.com`,
    subject: `${clusterName} has been ${message} by CleanCloud`,
    text: `Hello ${startedBy}, ${clusterName} has been ${message}.`,
    html: `Hello ${startedBy}, <br><br>
     ${clusterName} has been ${message}. <br><br>
     CleanCloud`,
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) log.error(err);
    log.info(`Email sent to ${startedBy}`);
  });
};
