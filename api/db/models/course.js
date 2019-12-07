"use strict";

const Sequelize = require("sequelize");

// defines and initializes Course model
module.exports = sequelize => {
  class Course extends Sequelize.Model {}
  Course.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Hmm. Looks like you forgot to add a Title"
          },
          notEmpty: {
            msg: "Hmm. Looks like you forgot to add a Title"
          }
        }
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Hmm. Looks like you forgot to add a Description"
          },
          notEmpty: {
            msg: "Hmm. Looks like you forgot to add a Description"
          }
        }
      },
      estimatedTime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      materialsNeeded: {
        type: Sequelize.STRING,
        allowNull: true
      }
    },
    { sequelize }
  );

  Course.associate = models => {
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: "userId"
      }
    });
  };

  return Course;
};
