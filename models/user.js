"use strict";
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const { Model, DataTypes } = Sequelize;

module.exports = (sequelize) => {
    class User extends Model {}
    User.init ({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "First name required"
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Last name required"
                }
            }            
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "email required"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(val) {
                const hashedPassword = bcrypt.hashSync(val, 10);
                this.setDataValue("password", hashedPassword);
              }, 
            validate: {
                notNull: {
                    msg: "password required"
                }
            }
        }
    }, {sequelize, modelName: "User" });
    
    User.associate = (models) => {
        User.hasMany(models.Course, {
            as: "teacher",
            foreignKey: {
                fieldName: "userId",
                allowNull: false
            }

        })
    }
    return User;
;}

