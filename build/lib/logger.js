'use strict';

var winston = require('winston');

var logger = module.exports = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: new Date().toDateString().replace(/ /g, '-') + '.log', level: 'verbose' }), new winston.transports.Console({ format: winston.format.simple(), level: 'info' })]
});

logger.INFO = 'info';
logger.ERROR = 'error';