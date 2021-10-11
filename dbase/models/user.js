'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static encryptPassword = (plainText, salt) => crypto.createHash('RSA-SHA256').update(plainText).update(salt).digest('hex');
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //     is: {
      //         args: /[0-9]{6,}/,
      //         // eslint-disable-next-line quotes
      //         msg: `
      //             Password must be NOT less than 6 characters long,
      //             containing at least one number, one special character,
      //             one upper and lower case letter.
      //             `,
      //     },
      // }
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'User' // We need to choose the model name
  });

  User.prototype.GetUser = function () {
    return {
      id: this.id,
      login: this.login,
    };
  };
  return User;
};