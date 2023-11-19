const restaurantDB = require("../models/restaurant.model");
const userDB = require("../models/user.model");

exports.getAllRestaurants = async (req, res) => {
  const restaurants = await restaurantDB.getAll();
  if (restaurants) {
    res.json({ restaurants });
  } else {
    res.json({ title: "Error", body: "No Data available." });
  }
};

exports.getAllPointed = async (req, res) => {
  const users = await userDB.getAllByPointed(true);
  if (users) {
    res.json({
      users: users.map((user) => {
        return { id: user.id, name: user.name };
      }),
    });
  } else {
    res.json({ title: "Error", body: "No Data available." });
  }
};
exports.createUser = async (req, res) => {
  try {
    let row = await userDB.createNew({code: req.body.code, name:req.body.username});
    res.json({done: true})
  } catch (error) {
    console.log(error);
  }
};
exports.createRestaurant = async (req, res) => {
  try {
    let row = await restaurantDB.createNew({name: req.body.name});
    res.json({done: true})
  } catch (error) {
    console.log(error);
  }
};

exports.getAllUnPointed = async (req, res) => {
  const users = await userDB.getAllByPointed(false);
  if (users) {
    res.json({
      users: users.map((user) => {
        return { id: user.id, name: user.name };
      }),
    });
  } else {
    res.json({ title: "Error", body: "No Data available." });
  }
};

exports.submit = async (req, res) => {
  try {
    let answer = await userDB.submit(req.body);
    if (answer.error) {
      res.status(201).json({ title: "error", body: answer.error });
    } else {
      res
        .status(201)
        .json({ title: "success", body: "Action submitted successfuly" });
    }
  } catch (error) {
    console.log(error);
  }
};
