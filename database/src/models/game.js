
const { Model, DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    class Game extends Model { }
    Game.init(
        {
            playerId: DataTypes.NUMBER,
            score: DataTypes.NUMBER,
            type: DataTypes.STRING,
            attributes: DataTypes.JSON,
        }, { sequelize, modelName: 'game' });


    return {
        Game
    }
}