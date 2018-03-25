/* eslint no-unused-vars: 0 */
const htmlToText = require('html-to-text');
const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger('email');
const MailListener = require('mail-listener2');
const CLUSTER_CONTROLLER = require('./cluster');

const mailListener = new MailListener({
  username: process.env.IMAP_EMAIL,
  password: process.env.IMAP_PASSWORD,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  connTimeout: 10000,
  authTimeout: 5000,
  tlsOptions: {
    rejectUnauthorized: false,
  },
  mailbox: 'INBOX',
  searchFilter: ['UNSEEN'],
  markSeen: true,
  fetchUnreadOnStart: true,
});

const SES = new AWS.SES({
  apiVersion: '2010-12-01',
  region: 'us-east-1',
});

LOGGER.level = 'info';

function openInbox(callback) {
  mailListener.imap.openBox('INBOX', true, callback);
}

module.exports.startMonitor = () => {
  mailListener.start();
};

module.exports.emailStartedBy = (clusterName, startedBy, message) => {
  LOGGER.info(`Building email for ${startedBy}`);
  const params = {
    Destination: {
      BccAddresses: [],
      CcAddresses: [],
      ToAddresses: [
        'rdcaldwell5705@eagle.fgcu.edu',
      ],
    },
    Message: {
      Body: {
        Html: {
          Data: `Hello ${startedBy}, <br> ${clusterName} has been ${message}.`,
          Charset: 'UTF-8',
        },
        Text: {
          Data: `Hello ${startedBy}, ${clusterName} has been ${message}.`,
          Charset: 'UTF-8',
        },
      },
      Subject: {
        Data: `${clusterName} has been ${message} by CleanCloud`,
        Charset: 'UTF-8',
      },
    },
    Source: 'cloudianapp@gmail.com',
  };
  SES.sendEmail(params, (err, data) => {
    if (err) LOGGER.error(err);
    else LOGGER.info(`Email sent to ${startedBy}`);
  });
};

mailListener.on('mail', () => {
  LOGGER.info('Parsing new email');
  openInbox((err, box) => {
    if (err) throw err;
    const f = mailListener.imap.seq.fetch(`${box.messages.total}:*`, {
      bodies: ['TEXT'],
    });
    f.on('message', (msg) => {
      msg.on('body', (stream) => {
        let buffer = '';
        stream.on('data', (chunk) => {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', () => {
          const ids = htmlToText.fromString(buffer.toString()).trim().split(',');
          CLUSTER_CONTROLLER.findClusters(ids);
        });
      });
    });
  });
});

mailListener.on('server:connected', () => {
  LOGGER.info('Monitor listening');
});

mailListener.on('server:disconnected', () => {
  LOGGER.info('Monitor disconnected');
});

mailListener.on('error', (err) => {
  LOGGER.error(err);
});
