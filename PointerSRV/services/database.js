exports.initDataBase = async (db) => {
  await exports.runSync(
    db,
    `
        CREATE TABLE IF NOT EXISTS RESTAURANTS (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
  );
  await exports.runSync(
    db,
    `
        CREATE TABLE IF NOT EXISTS USERS (
            id INTEGER PRIMARY KEY,
            code TEXT NOT NULL,
            name TEXT NOT NULL UNIQUE,
            pointed BOOLEAN NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
  );
  await exports.runSync(
    db,
    `
        CREATE TABLE IF NOT EXISTS USER_POINTING (
            id INTEGER PRIMARY KEY,
            action TEXT NOT NULL,
            userId INTEGER NOT NULL,
            restaurantId INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(restaurantId) REFERENCES RESTAURANTS(id),
            FOREIGN KEY(userId) REFERENCES USERS(id)
        );`
  );
};
exports.createData = async function (db) {
  let usersList = [
    { name: "Ghassen", code: "3087" },
    { name: "Mourad", code: "1211" },
    { name: "Haj", code: "894" },
    { name: "Yakoub", code: "2204" },
    { name: "Khalil", code: "2601" },
    { name: "Wael", code: "2906" },
    { name: "Musli", code: "0306" },
    { name: "Autre", code: "1111" },
  ];
  let restaurants = [
    { name: "Mio pizza Fribourg" },
    { name: "Walima Fribourg" },
    { name: "Walima Payerne" },
  ];
  for (let idx = 0; idx < usersList.length; idx++) {
    const user = usersList[idx];
    try {
      await exports.runSync(
        db,
        `INSERT INTO USERS (code, name, pointed) VALUES (?, ?, ?)`,
        [user.code, user.name, false]
      );
    } catch (err) {
      console.log(err);
    }
  }
  for (let idx = 0; idx < restaurants.length; idx++) {
    const rest = restaurants[idx];
    try {
      await exports.runSync(db, `INSERT INTO RESTAURANTS (name) VALUES (?)`, [
        rest.name,
      ]);
    } catch (err) {
      console.log(err);
    }
  }
};
exports.runSync = function (db, sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};
exports.getSync = function (db, sql, params) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, function (err, row) {
      if (err) reject(err);
      else resolve(row);
    });
  });
};
exports.getAllSync = function (db, sql, params) {
  return new Promise((resolve, reject) => {
    db.all(sql, params ? params : [], function (err, rows) {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
