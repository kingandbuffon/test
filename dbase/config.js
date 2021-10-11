require('dotenv').config();

module.exports = {
  development: {
    database: process.env.DBNAME,
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    dialect: 'postgres',
    logging: true,
  },
  test: {
    database: process.env.DBNAME,
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    database: process.env.DBNAME,
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    dialect: 'postgres',
    logging: false,
  },
};