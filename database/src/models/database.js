const { Low, JSONFile } = require('@commonify/lowdb');
const { Sequelize } = require('sequelize');
module.exports = function () {

  // Create Sequelize instance
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/database.sqlite'
  });

  const { User } = require('./user.js')(sequelize);
  const { Game } = require('./game.js')(sequelize);

  const models = { User, Game }
  // Sync models with database
  sequelize.sync();

  async function read(model) {
    const response = await model.findAll();
    return response
  }
  async function write(model, data) {
    const resposne = await model.create(data);
    console.log("new record added", resposne)
    return resposne
  }

  async function update(model, key, value, data) {
    console.log("update", model, key, value, data)
    await model.update(data, {
      where: {
        [key]: value
      }
    });
    return await getByKey(model, key, value)
  }

  async function deleteByKey(model, key, value) {
    console.log("deleteByKey", model, key, value)
    try {
      const response = await model.destroy({ where: { [key]: value } });
      return response
    } catch (e) {
      console.error("Error deleting data by key:", e);
      return false;
    }
  }

  async function getByKey(model, key, value) {
    console.log("getByKey", model, key, value)
    try {
      return await model.findOne({ where: { [key]: value } });
    } catch (e) {
      console.error("Error fetching data by key:", e);
      return null
    }
  }

  async function getAllByKey(model, key, value) {
    console.log("getByKey", model, key, value)
    try {
      return await model.findAll({ where: { [key]: value } });
    } catch (e) {
      console.error("Error fetching data by key:", e);
      return null
    }
  }



  return {
    models,
    write,
    read,
    deleteByKey,
    update,
    getByKey,
    getAllByKey
  }
}

// const { Op } = require('sequelize'); // Import Sequelize operators for querying

/**
 * Get the top score of all time
 */
// async function getTopScoreAllTime() {
//     try {
//         const topUser = await User.findOne({
//             order: [['score', 'DESC']], // Order by score in descending order
//         });
//         return topUser ? topUser.toJSON() : null;
//     } catch (error) {
//         console.error("Error fetching top score of all time:", error);
//     }
// }

/**
 * Get the top score for today
 */
// async function getTopScoreToday() {
//     try {
//         // Get the start of today
//         const startOfDay = new Date();
//         startOfDay.setHours(0, 0, 0, 0);

//         // Get the end of today
//         const endOfDay = new Date();
//         endOfDay.setHours(23, 59, 59, 999);

//         const topUserToday = await User.findOne({
//             where: {
//                 createdAt: {
//                     [Op.between]: [startOfDay, endOfDay], // Filter by today's date range
//                 },
//             },
//             order: [['score', 'DESC']], // Order by score in descending order
//         });

//         return topUserToday ? topUserToday.toJSON() : null;
//     } catch (error) {
//         console.error("Error fetching top score today:", error);
//     }
// }

/**
 * Get the last 5 users added to the database
 */
// async function getLast5Users() {
//     try {
//         const lastUsers = await User.findAll({
//             order: [['createdAt', 'DESC']], // Order by `createdAt` in descending order
//             limit: 5, // Limit the results to 5
//         });
//         return lastUsers.map(user => user.toJSON());
//     } catch (error) {
//         console.error("Error fetching last 5 users:", error);
//     }
// }
