const logger = require('../services/logger')(module);

// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  logger.error(err.stack);
  const status = err.status >= 200 && err.status <= 500 ? err.status : 500;
  res.status(status).json({ error: err.message });
}

// eslint-disable-next-line consistent-return
function catchError(fn) {
  return (req, res, next) => fn(req, res, next)
    .catch((e) => next(e));
}

// function catchError(fn) {
//   return (req, res, next) => {
//       try {
//           fn(req, res, next).catch((e)=>{
//               next(e);
//           })
//       } catch (e) {
//           logger.error(e.stack);
//           next(e);
//       }
//   }
// }

module.exports = {
  errorMiddleware,
  catchError,
};
