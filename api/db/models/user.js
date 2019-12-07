"use strict";

// require sequelize
const Sequelize = require("sequelize");

// defines and initializes User model
module.exports = sequelize => {
  class User extends Sequelize.Model {}
  User.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Hmm. Looks like you forgot to add a First Name"
          },
          notEmpty: {
            msg: "Hmm. Looks like you forgot to add a First Name"
          }
        }
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Hmm. Looks like you forgot to add a Last Name"
          },
          notEmpty: {
            msg: "Hmm. Looks like you forgot to add a Last Name"
          }
        }
      },
      emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Hmm. Looks like you forgot to add an Email Address"
          },
          isEmail: {
            msg: "Hmm. Looks like you forgot to add an Email Address"
          }
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Hmm. Looks like you forgot to add a Password"
          },
          notEmpty: {
            msg: "Hmm. Looks like you forgot to add a Password"
          }
        }
      }
    },
    { sequelize }
  );

  User.associate = models => {
    //Sets up sequelize 1:M relationship for users and courses
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: "userId"
      }
    });
  };

  return User;
};
