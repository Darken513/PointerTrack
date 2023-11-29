const restaurantDB = require("../models/restaurant.model");
const userDB = require("../models/user.model");
const user_pointDB = require("../models/user_point.model");
const { transporter } = require('../services/scheduler');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
var path = require('path');

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
    let row = await userDB.createNew({ code: req.body.code, name: req.body.username });
    res.json({ done: true })
    sendNewDB()
  } catch (error) {
    console.log(error);
  }
};
exports.createRestaurant = async (req, res) => {
  try {
    let row = await restaurantDB.createNew({ name: req.body.name });
    res.json({ done: true })
    sendNewDB()
  } catch (error) {
    console.log(error);
  }
};
exports.deleteRestaurantById = async (req, res) => {
  try {
    let row = await restaurantDB.deleteRestaurantById({ restaurantId: req.params.restaurantId });
    res.json({ done: true })
    sendNewDB()
  } catch (error) {
    console.log(error);
  }
};
exports.deleteUserById = async (req, res) => {
  try {
    let row = await userDB.deleteUserById({ userId: req.params.userId });
    res.json({ done: true })
    sendNewDB()
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
    sendNewDB()
  } catch (error) {
    console.log(error);
  }
};
exports.getAllFromTo = async (req, res) => {
  try {
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let toDownload = req.body.toDownload;
    let data = await user_pointDB.getAllFromTo(startDate, endDate);
    let parsedData = parseDataIntoNested(data);
    let afterCalc = calculateTimeSpentForEach_User_Restaurant(parsedData);
    let final = turnIntoDevelopedArray(afterCalc);
    fs.writeFileSync('output.csv', '');
    // Write the data to the CSV file
    console.log('Attempting to rewrite the output.csv file - on admin request')
    // Define the CSV writer
    const csvWriter = createCsvWriter({
      path: 'output.csv',
      header: [
        { id: 'user', title: 'User' },
        { id: 'restaurant', title: 'Restaurant' },
        { id: 'time', title: 'Time' },
        { id: 'remarques', title: 'Remarques' }
      ],
    });
    csvWriter.writeRecords(final)
      .then(() => {
        if (toDownload) {
          res.sendFile(path.resolve(__dirname+"/../output.csv"));
          return;
        }
        sendMail(req.body)
        res
          .status(201)
          .json({ title: "success", body: "Email sent successfuly" });
      })
      .catch(error => console.error('Error writing CSV file:', error));
  } catch (error) {
    console.log(error);
  }
}

function sendNewDB() {
  const mailOptions = {
    from: "PointerTrackerDB",
    to: 'PointerTracker33@gmail.com',
    subject: 'Lastes DB changes',
    text: 'A new change has occured in your DB',
    attachments: [
      {
        filename: 'database.db',
        path: __dirname + "/../database.db",
      },
    ],
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

function formatTime(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = seconds % 60;

  return `${hours}h ${minutes}min ${remainingSeconds}sec`;
}

function parseDataIntoNested(inputList) {
  const nestedObject = {};
  inputList.forEach(item => {
    const { user, restaurant, action, time } = item;
    if (!nestedObject[user]) {
      nestedObject[user] = {};
    }
    if (!nestedObject[user][restaurant]) {
      nestedObject[user][restaurant] = {};
    }
    if (!nestedObject[user][restaurant][action]) {
      nestedObject[user][restaurant][action] = [];
    }
    nestedObject[user][restaurant][action].push(time);
  });
  return nestedObject;
}

function calculateTimeSpentForEach_User_Restaurant(allUsers) {
  Object.keys(allUsers).forEach(user => {
    let userRecord = allUsers[user];
    Object.keys(userRecord).forEach(restaurant => {

      let restaurantRecord = userRecord[restaurant];
      restaurantRecord.delayed = [];
      restaurantRecord.total = 0;

      checkingIn = restaurantRecord['Pointage']
      checkingOut = restaurantRecord['Depointage']

      let totalSeconds = 0;

      for (let i = 0; i < checkingIn.length; i++) {
        const checkInTime = (checkingIn && checkingIn[i]) ? new Date(checkingIn[i]) : undefined;
        const checkOutTime = (checkingOut && checkingOut[i]) ? new Date(checkingOut[i]) : undefined;

        if (!checkOutTime) {
          restaurantRecord.delayed.push(checkingIn[i] + ' - pas encore');
          continue; // Skip this iteration
        }
        // Check if check-out is delayed by more than a day
        if (checkOutTime - checkInTime < 0 || checkOutTime - checkInTime > 24 * 60 * 60 * 1000) {
          restaurantRecord.delayed.push(checkingIn[i] + ' - ' + checkingOut[i]);
          continue; // Skip this iteration
        }

        const timeDiffInSeconds = (checkOutTime - checkInTime) / 1000;
        totalSeconds += timeDiffInSeconds;
      }
      totalString = formatTime(totalSeconds)
      restaurantRecord.total = totalString;
    });
  })
  return allUsers;
}

function turnIntoDevelopedArray(object) {
  let toret = [];
  Object.keys(object).forEach(userName => {
    let userObj = object[userName];
    Object.keys(userObj).forEach(restaurantName => {
      let restaurantObj = userObj[restaurantName];
      toPush = { user: userName, restaurant: restaurantName, time: restaurantObj.total, remarques: restaurantObj.delayed }
      toret.push(toPush);
    })
  })
  return toret;
}

function sendMail(fromToDetails) {
  let reportName = "Rapport de " + fromToDetails.startDate + " à " + fromToDetails.endDate;

  const mailOptions = {
    from: "PointerTracker",
    to: 'ghassen.hentati@hotmail.com',
    cc: 'affesachraf70@gmail.com',
    subject: reportName,
    text: 'Please find the attached CSV file.',
    attachments: [
      {
        filename: 'Rapport_de_+' + fromToDetails.startDate + "_" + fromToDetails.endDate + '.csv',
        path: 'output.csv',
      },
    ],
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};