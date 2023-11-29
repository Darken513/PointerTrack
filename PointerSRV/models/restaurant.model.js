const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(__dirname + "/../database.db");
const db_utils = require("../services/database");

exports.createNew = async ({ name }) => {
  try {
    return await db_utils.runSync(
      db,
      `INSERT INTO RESTAURANTS (name) VALUES (?)`,
      [name]
    );
  } catch (err) {
    return {
      error: err.message.includes("SQLITE_CONSTRAINT")
        ? "RESTAURANT already exists"
        : "An error has occurred",
    };
  }
};
exports.deleteRestaurantById = async ({ restaurantId }) => {
  try {
    await db_utils.runSync(
      db,
      `UPDATE RESTAURANTS SET enabled = FALSE WHERE id = ?`,
      [restaurantId]
    );
    return true;
  } catch (err) {
    console.log(err);
    return {
      error: err.message.includes("SQLITE_CONSTRAINT")
        ? "User doesnt exist or already deleted"
        : "An error has occurred",
    };
  }
};
exports.getById = async (id) => {
  const query = `SELECT * FROM RESTAURANTS WHERE id = ?`;
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
    let rows = await db_utils.getAllSync(db, `SELECT * FROM RESTAURANTS WHERE enabled=TRUE`);
    return rows ? rows : [];
  } catch (err) {
    console.log(err);
    return { error: err.message };
  }
};
