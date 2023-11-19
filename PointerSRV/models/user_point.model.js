const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(__dirname + "/../database.db");
const db_utils = require("../services/database");
const userDB = require("./user.model");
const restaurantDB = require("./restaurant.model");

exports.createNew = async ({ action, userId, restaurantId }) => {
  try {
    return await db_utils.runSync(
      db,
      `INSERT INTO USER_POINTING (action, userId, restaurantId) VALUES (?, ?, ?)`,
      [action, userId, restaurantId]
    );
  } catch (err) {
    return {
      error: err.message.includes("SQLITE_CONSTRAINT")
        ? "RESTAURANT already exists"
        : "An error has occurred",
    };
  }
};
exports.getAllForToday = async () => {
  const query = `SELECT * FROM USER_POINTING WHERE DATE(created_at) = DATE('now')`;
  try {
    let rows = await db_utils.getAllSync(db, query);
    if(!rows)
      return []
    let toret = []
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      restaurantName = (await restaurantDB.getById(row.restaurantId)).name;
      userName = (await userDB.getById(row.userId)).name;
      toret.push({user:userName, action: row.action, restaurant:restaurantName, time: row.created_at});
    }
    toret.sort((a, b) => {
      // Compare by name
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      // If names are equal, compare by time
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      // If both name and time are equal, no change in order
      return 0;
    });
    return toret;
  } catch (err) {
    console.log(err);
    return { error: err.message };
  }
};
exports.getAllForMonthYear = async (month, year) => {
  try {
    const str = year + "-" + month;
    let rows = await db_utils.getAllSync(
      db,
      `SELECT * FROM USER_POINTING WHERE strftime('%Y-%m', created_at) = ?`,
      [str]
    );
    if(!rows)
      return []
    let toret = []
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      restaurantName = (await restaurantDB.getById(row.restaurantId)).name;
      userName = (await userDB.getById(row.userId)).name;
      toret.push({user:userName, action: row.action, restaurant:restaurantName, time: row.created_at});
    }
    toret.sort((a, b) => {
      // Compare by name
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      // If names are equal, compare by time
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      // If both name and time are equal, no change in order
      return 0;
    });
    return toret;
  } catch (err) {
    console.log(err);
    return { error: err.message };
  }
};
exports.getAllForMonthYear_ByUserId = async (month, year, userId) => {
  try {
    const str = year + "-" + month;
    let rows = await db_utils.getAllSync(
      db,
      `SELECT * FROM USER_POINTING WHERE strftime('%Y-%m', created_at) = ? AND userId = ? `,
      [str, userId]
    );
    if(!rows)
      return []
    let toret = []
    userName = (await userDB.getById(userId)).name;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      restaurantName = (await restaurantDB.getById(row.restaurantId)).name;
      toret.push({user:userName, action: row.action, restaurant:restaurantName, time: row.created_at});
    }
    toret.sort((a, b) => {
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      // If times are equal, no change in order
      return 0;
    });
    return toret;
  } catch (err) {
    console.log(err);
    return { error: err.message };
  }
};
