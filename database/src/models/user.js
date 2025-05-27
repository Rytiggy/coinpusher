
const { Model, DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    class User extends Model { }
    User.init(
        {
            tickets: DataTypes.NUMBER,
            player: DataTypes.STRING,
            chips: DataTypes.NUMBER,
            uid: DataTypes.STRING,
        }, { sequelize, modelName: 'user' });


    return {
        User
    }
}