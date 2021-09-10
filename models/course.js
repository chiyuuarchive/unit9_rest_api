"use strict";
const Sequelize = require("sequelize");
const { Model } = Sequelize;

module.exports = (sequelize) => {
    class Course extends Model {}
    Course.init ({
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Title is required."
                },
                notEmpty: {
                    msg: "Please provide the title for the course."
                }
            }
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notNull: { 
                    msg: "Description is required."
                },
                notEmpty: {
                    msg: "Please provide a description to the course."
                }
            }

        },
        estimatedTime: {
            type: Sequelize.STRING
        },
        materialsNeeded: {
            type: Sequelize.STRING
        }
        
    }, { sequelize })
   
    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            as: "teacher",
            foreignKey: {
                fieldName: "userId",
                allowNull: false
            }
        });
    }
    
    return Course;
}

