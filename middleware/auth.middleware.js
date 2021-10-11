const httpContext = require('express-http-context');

const jwt = require('jsonwebtoken');
const logger = require('../services/logger')(module);

require('dotenv').config();

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).end();
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    if(decoded.refresh){
      return res.status(401).end();
    }
    req.id = decoded.id;
    httpContext.set('id', decoded?.id);
    return next();
  } catch (error) {
    logger.error('Not authorized');
    return res.status(401).end();
  }
};
