const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(__dirname + "/../database.db");
const db_utils = require("../services/database");
const user_pointDB = require("./user_point.model");

exports.createNew = async ({ code, name }) => {
  try {
    let user = await db_utils.runSync(
      db,
      `INSERT INTO USERS (code, name, pointed) VALUES (?, ?, false)`,
      [code, name]
    );
    return user;
  } catch (err) {
    console.log(err);
    return {
      error: err.message.includes("SQLITE_CONSTRAINT")
        ? "User already exists"
        : "An error has occurred",
    };
  }
};
exports.getById = async (id) => {
  const query = `SELECT * FROM USERS WHERE id = ?`;
  try {
    let row = await db_utils.getSync(db, query, [id]);
    return row ? row : undefined; //refactor this into a base model class
  } catch (err) {
    console.log(err);
    return { error: err.message };
  }
};
exports.getAll = async () => {
  try {
    let rows = await db_utils.getAllSync(db, `SELECT * FROM USERS`);
    return rows ? rows : [];
  } catch (err) {
    console.log(err);
    return { error: err.message };
  }
};
exports.getAllByPointed = async (pointed) => {
  try {
    let rows = await db_utils.getAllSync(
      db,
      `SELECT * FROM USERS WHERE pointed = ?`,
      [pointed]
    );
    return rows ? rows : [];
  } catch (err) {
    console.log(err);
    return { error: err.message };
  }
};
exports.submit = async (data) => {
  try {
    let row = await db_utils.getSync(db, `SELECT * FROM USERS WHERE id = ?`, [
      data.user.id,
    ]);
    if (!row) return { error: "user doesnt exist" };
    if (row.code != data.user.code) return { error: "wrong code" };
    await db_utils.runSync(
      db,
      `UPDATE USERS SET pointed = ? WHERE id = ?`,
      [data.actionDone == "Pointage" ? true : false, data.user.id]
    );
    await user_pointDB.createNew({
      action: data.actionDone,
      userId: data.user.id,
      restaurantId: data.restaurant.id,
    });
    return row ? row : [];
  } catch (err) {
    console.log(err);
    return { error: err.message };
  }
};
