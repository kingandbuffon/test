'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Contact extends Model {
        static associate(models) {
            Contact.hasMany(models.Company, {
                as: 'company',
            });
        }
    }

    Contact.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        patronymic: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                is: {
                    args: /^(8|7)[\d]{10}$/,
                    msg: 'Please enter valid phone value.',
                },
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: 'Please enter valid email value.'
                },
            },
        }
    }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Contact', // We need to choose the model name
        underscored: true,
    });

    Contact.prototype.GetContact = function () {
        return {
            id: this.id,
            firstname: this.firstname,
            lastname: this.lastname,
            patronymic: this.patronymic,
            phone: this.phone,
            email: this.email,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    };
    return Contact;
};