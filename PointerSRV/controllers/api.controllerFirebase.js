const { transporter } = require("../services/scheduler");
const { db } = require("../server");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
var path = require("path");

const usersRef = db.collection("users");
const restaurantsRef = db.collection("restaurants");
const userPointingRef = db.collection("USER_POINTING");
const vehiclesRef = db.collection("vehicles");

exports.getAllVehicles = async (req, res) => {
  try {
    const snapshot = await vehiclesRef.where("enabled", "==", true).get();
    const vehicles = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    res.json({ vehicles });
  } catch (error) {
    console.error("Error getting documents:", error);
    res.json({ title: "Error", body: "No Data available." });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const snapshot = await restaurantsRef.where("enabled", "==", true).get();
    const restaurants = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    res.json({ restaurants });
  } catch (error) {
    console.error("Error getting documents:", error);
    res.json({ title: "Error", body: "No Data available." });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const snapshot = await usersRef.where("enabled", "==", true).get();
    const users = snapshot.docs.map((doc) => {
      return { id: doc.id, name: doc.data().name };
    });
    res.json({ users });
  } catch (error) {
    console.error("Error getting documents:", error);
    res.json({ title: "Error", body: "No Data available." });
  }
};

exports.getAllPointed = async (req, res) => {
  try {
    const snapshot = await usersRef
      .where("pointed", "==", true)
      .where("pointedRestaurant", "==", req.params.restaurantId)
      .get();
    const users = snapshot.docs
      .filter((doc) => doc.data().enabled)
      .map((doc) => {
        return { id: doc.id, name: doc.data().name };
      });
    res.json({ users });
  } catch (error) {
    console.error("Error getting documents:", error);
    res.json({ title: "Error", body: "No Data available." });
  }
};

exports.getAllUnPointed = async (req, res) => {
  try {
    const snapshot = await usersRef.where("pointed", "==", false).get();
    const users = snapshot.docs
      .filter((doc) => doc.data().enabled)
      .map((doc) => {
        return { id: doc.id, name: doc.data().name };
      });
    res.json({ users });
  } catch (error) {
    console.error("Error getting documents:", error);
    res.json({ title: "Error", body: "No Data available." });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const data = { name: req.body.name, enabled: true, created_at: new Date() };
    const docRef = await vehiclesRef.add(data);
    console.log("Vehicle added with ID:", docRef.id);
    res.json({ done: true });
  } catch (error) {
    console.error("Error adding Vehicle:", error);
    res.json({ done: false });
  }
};

exports.createUser = async (req, res) => {
  try {
    const data = {
      code: req.body.code,
      name: req.body.username,
      enabled: true,
      pointed: false,
      created_at: new Date(),
    };
    const docRef = await usersRef.add(data);
    console.log("Document added with ID:", docRef.id);
    res.json({ done: true });
  } catch (error) {
    console.error("Error adding document:", error);
    res.json({ done: false });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    const data = { name: req.body.name, enabled: true, created_at: new Date() };
    const docRef = await restaurantsRef.add(data);
    console.log("Document added with ID:", docRef.id);
    res.json({ done: true });
  } catch (error) {
    console.error("Error adding document:", error);
    res.json({ done: false });
  }
};

exports.deleteVehicleById = async (req, res) => {
  try {
    const docRef = vehiclesRef.doc(req.params.vehicleId);
    await docRef.delete();
    console.log(
      "Vehicle with ID:",
      req.params.vehicleId,
      "deleted successfully."
    );
    res.json({ done: true });
  } catch (error) {
    console.error("Error deleting Vehicle:", error);
    res.json({ done: false });
  }
};

exports.deleteRestaurantById = async (req, res) => {
  try {
    const docRef = restaurantsRef.doc(req.params.restaurantId);
    await docRef.delete();
    console.log(
      "Restaurant with ID:",
      req.params.restaurantId,
      "deleted successfully."
    );
    res.json({ done: true });
  } catch (error) {
    console.error("Error deleting Restaurant:", error);
    res.json({ done: false });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const docRef = usersRef.doc(req.params.userId);
    await docRef.delete();
    console.log("User with ID:", req.params.userId, "deleted successfully.");
    res.json({ done: true });
  } catch (error) {
    console.error("Error deleting User:", error);
    res.json({ done: false });
  }
};

exports.selectedVehicle = async (req, res) => {
  try {
    const updateData = {
      vehicleId: req.params.vehicleId,
    };
    const docRef = userPointingRef.doc(req.params.id);
    await docRef.update(updateData);
    console.log("Pointage with ID:", req.params.id, "updated successfully.");
    res.status(201).json({ title: "success", body: "updated successfully." });
  } catch (error) {
    console.error("Error updating Pointage:", error);
    res.status(201).json({ title: "error", body: error });
    return;
  }
};

exports.submit = async (req, res) => {
  try {
    const docRef = usersRef.doc(req.body.user.id);
    const user = (await docRef.get()).data();
    if (user.code != req.body.user.code) {
      res.status(201).json({ title: "error", body: "wrong code"});
      return;
    }
    const updateData = {
      pointed: req.body.actionDone == "Pointage" ? true : false,
      pointedRestaurant: req.body.restaurant.id,
    };
    await docRef.update(updateData);
    console.log("User with ID:", req.body.user.id, "updated successfully.");
  } catch (error) {
    console.error("Error updating User:", error);
    res.status(201).json({ title: "error", body: error });
    return;
  }
  try {
    const data = {
      action: req.body.actionDone,
      userId: req.body.user.id,
      restaurantId: req.body.restaurant.id,
      created_at: new Date(),
    };
    const docRef = await userPointingRef.add(data);
    console.log("Pointage added with ID:", docRef.id);
    res
      .status(201)
      .json({
        title: "success",
        body: "Action submitted successfuly",
        id: docRef.id,
      });
  } catch (error) {
    console.error("Error adding Pointage:", error);
    res.status(201).json({ title: "error", body: error });
    return;
  }
};

exports.getAllFromTo = async (req, res) => {
  let toDownload = req.body.toDownload;
  let data = [];
  try {
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    endDate.setHours(endDate.getHours() + 23);
    endDate.setMinutes(endDate.getMinutes() + 59);
    endDate.setSeconds(endDate.getSeconds() + 59);

    const snapshot = await userPointingRef
      .where("created_at", ">=", startDate)
      .where("created_at", "<=", endDate)
      .get();

    if (!snapshot.empty) {
      let toret = [];
      for (let i = 0; i < snapshot.docs.length; i++) {
        const doc = snapshot.docs[i];
        //get restaurant data
        const restaurantdocRef = restaurantsRef.doc(doc.data().restaurantId);
        const restaurantDoc = await restaurantdocRef.get();
        if (!restaurantDoc.exists) {
          continue;
        }
        const restaurant = restaurantDoc.data();
        //get user data
        const userdocRef = usersRef.doc(doc.data().userId);
        const userDoc = await userdocRef.get();
        if (!userDoc.exists) {
          continue;
        }
        const user = userDoc.data();
        //get vehicle data
        let vehicle = "";
        if (doc.data().vehicleId) {
          const vehicledocRef = vehiclesRef.doc(doc.data().vehicleId);
          const vehicleDoc = await vehicledocRef.get();
          if (vehicleDoc.exists) {
            vehicle = vehicleDoc.data().name;
          }
        }
        toret.push({
          user,
          action: doc.data().action,
          restaurant,
          time: doc.data().created_at,
          vehicle,
        });
      }
      //cleaning deleted restaurants && users
      toret = toret.filter(
        (data) => data.user.enabled && data.restaurant.enabled
      );
      //reducing data by getting rid of details
      toret = toret.map((data) => {
        return {
          user: data.user.name,
          action: data.action,
          restaurant: data.restaurant.name,
          time: data.time.toDate(),
          vehicle: data.vehicle,
        };
      });
      toret.sort((a, b) => {
        // Compare by name
        if (a.user < b.user) return -1;
        if (a.user > b.user) return 1;
        // If names are equal, compare by time
        if (a.time < b.time) return -1;
        if (a.time > b.time) return 1;
        // If both name and time are equal, no change in order
        return 0;
      });
      //send version one of complete details & then version 2 of simply the time all in all
      let parsedData1 = parseDataIntoNested(toret);
      let parsedData2 = parseDataIntoNested(toret);
      let afterCalc1 = calculateTimeSpentForEach_User_Restaurant(parsedData1);
      let afterCalc2 =
        calculateTimeSpentForEach_User_RestaurantDeveloped(parsedData2);
      let final1 = turnIntoDevelopedArray(afterCalc1);
      let final2 = turnIntoDevelopedArrayCaseAllDetails(afterCalc2);

      fs.writeFileSync("output.csv1", "");
      fs.writeFileSync("output.csv2", "");
      // Write the data to the CSV file
      try {
        console.log(
          "Attempting to rewrite the output.csv file - on admin request"
        );
        const csvWriter1 = createCsvWriter({
          path: "output1.csv",
          header: [
            { id: "user", title: "User" },
            { id: "restaurant", title: "Restaurant" },
            { id: "time", title: "Time" },
            { id: "remarques", title: "Remarques" },
          ],
        });
        await csvWriter1.writeRecords(final1);
        const csvWriter2 = createCsvWriter({
          path: "output2.csv",
          header: [
            { id: "user", title: "User" },
            { id: "restaurant", title: "Restaurant" },
            { id: "started_at", title: "Pointage" },
            { id: "ended_at", title: "Depointage" },
            { id: "time", title: "Time" },
            { id: "vehicle", title: "Vehicle" },
          ],
        });
        await csvWriter2.writeRecords(final2);
        if (toDownload) {
          res.sendFile(path.resolve(__dirname + "/../output1.csv"));
          res.sendFile(path.resolve(__dirname + "/../output2.csv"));
        } else {
          sendMail(req.body);
          res
            .status(201)
            .json({ title: "success", body: "Email sent successfully" });
        }
      } catch (error) {
        console.error("Error writing CSV file:", error);
        res
          .status(201)
          .json({ title: "error", body: "Error writing CSV file" });
      }
    }else{
      res.status(201).json({ title: "error", body: "No data to send." });
    }
  } catch (error) {
    console.error("Error getting documents:", error);
    res.status(201).json({ title: "error", body: "Error getting documents" });
  }
};

function formatTime(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = seconds % 60;

  return `${hours}h ${minutes}min ${Math.floor(remainingSeconds)}sec`;
}

function parseDataIntoNested(inputList) {
  const nestedObject = {};
  inputList.forEach((item) => {
    const { user, restaurant, action, time, vehicle } = item;
    if (!nestedObject[user]) {
      nestedObject[user] = {};
    }
    if (!nestedObject[user][restaurant]) {
      nestedObject[user][restaurant] = {};
    }
    if (!nestedObject[user][restaurant][action]) {
      nestedObject[user][restaurant][action] = [];
    }
    nestedObject[user][restaurant][action].push({ time, vehicle });
  });
  return nestedObject;
}

function calculateTimeSpentForEach_User_Restaurant(allUsers) {
  Object.keys(allUsers).forEach((user) => {
    let userRecord = allUsers[user];
    Object.keys(userRecord).forEach((restaurant) => {
      let restaurantRecord = userRecord[restaurant];
      restaurantRecord.delayed = [];
      restaurantRecord.total = 0;

      checkingIn = restaurantRecord["Pointage"];
      checkingOut = restaurantRecord["Depointage"];

      let totalSeconds = 0;

      for (let i = 0; i < checkingIn.length; i++) {
        const checkInTime =
          checkingIn && checkingIn[i]
            ? new Date(checkingIn[i].time)
            : undefined;
        const checkOutTime =
          checkingOut && checkingOut[i]
            ? new Date(checkingOut[i].time)
            : undefined;

        if (!checkOutTime) {
          restaurantRecord.delayed.push(
            checkInTime.toISOString().replace("T", " ").substring(0, 19) +
            " - pas encore"
          );
          continue; // Skip this iteration
        }
        // Check if check-out is delayed by more than a day
        if (
          checkOutTime - checkInTime < 0 ||
          checkOutTime - checkInTime > 24 * 60 * 60 * 1000
        ) {
          restaurantRecord.delayed.push(
            checkInTime.toISOString().replace("T", " ").substring(0, 19) +
            " - " +
            checkOutTime.toISOString().replace("T", " ").substring(0, 19)
          );
          continue; // Skip this iteration
        }

        const timeDiffInSeconds = (checkOutTime - checkInTime) / 1000;
        totalSeconds += timeDiffInSeconds;
      }
      totalString = formatTime(totalSeconds);
      restaurantRecord.total = totalString;
    });
  });
  return allUsers;
}

function calculateTimeSpentForEach_User_RestaurantDeveloped(allUsers) {
  Object.keys(allUsers).forEach((user) => {
    let userRecord = allUsers[user];
    Object.keys(userRecord).forEach((restaurant) => {
      let restaurantRecord = userRecord[restaurant];
      restaurantRecord.delayed = [];
      restaurantRecord.detailed = [];

      checkingIn = restaurantRecord["Pointage"];
      checkingOut = restaurantRecord["Depointage"];

      let totalSeconds = 0;

      for (let i = 0; i < checkingIn.length; i++) {
        const checkInTime =
          checkingIn && checkingIn[i]
            ? new Date(checkingIn[i].time)
            : undefined;
        const checkOutTime =
          checkingOut && checkingOut[i]
            ? new Date(checkingOut[i].time)
            : undefined;

        if (!checkOutTime) {
          restaurantRecord.delayed.push(
            checkInTime.toISOString().replace("T", " ").substring(0, 19) +
            " - pas encore"
          );
          continue; // Skip this iteration
        }
        // Check if check-out is delayed by more than a day
        if (
          checkOutTime - checkInTime < 0 ||
          checkOutTime - checkInTime > 24 * 60 * 60 * 1000
        ) {
          restaurantRecord.delayed.push(
            checkInTime.toISOString().replace("T", " ").substring(0, 19) +
            " - " +
            checkOutTime.toISOString().replace("T", " ").substring(0, 19)
          );
          continue; // Skip this iteration
        }
        const timeDiffInSeconds = (checkOutTime - checkInTime) / 1000;
        restaurantRecord.detailed.push({
          start: checkInTime.toISOString().replace("T", " ").substring(0, 19),
          end: checkOutTime.toISOString().replace("T", " ").substring(0, 19),
          total: formatTime(timeDiffInSeconds),
          vehicle: checkingOut[i].vehicle
        });
      }
    });
  });
  return allUsers;
}

function turnIntoDevelopedArray(object) {
  let toret = [];
  Object.keys(object).forEach((userName) => {
    let userObj = object[userName];
    Object.keys(userObj).forEach((restaurantName) => {
      let restaurantObj = userObj[restaurantName];
      toPush = {
        user: userName,
        restaurant: restaurantName,
        time: restaurantObj.total,
        remarques: restaurantObj.delayed,
      };
      toret.push(toPush);
    });
  });
  return toret;
}

function turnIntoDevelopedArrayCaseAllDetails(object) {
  let toret = [];
  Object.keys(object).forEach((userName) => {
    let userObj = object[userName];
    Object.keys(userObj).forEach((restaurantName) => {
      let restaurantObj = userObj[restaurantName];
      restaurantObj.detailed.forEach((details) => {
        toPush = {
          user: userName,
          restaurant: restaurantName,
          started_at: details.start,
          ended_at: details.end,
          time: details.total,
          vehicle: details.vehicle,
        };
        toret.push(toPush);
      });
    });
  });
  return toret;
}

function sendMail(fromToDetails) {
  let reportName =
    "Rapport de " + fromToDetails.startDate + " à " + fromToDetails.endDate;

  const mailOptions = {
    from: "PointerTracker",
    to: 'ghassen.hentati@hotmail.com',
    cc: 'affesachraf70@gmail.com',
    subject: reportName,
    text: "Please find the attached CSV file.",
    attachments: [
      {
        filename:
          "Rapport_de_+" +
          fromToDetails.startDate +
          "_" +
          fromToDetails.endDate +
          "_total.csv",
        path: "output1.csv",
      },
      {
        filename:
          "Rapport_de_+" +
          fromToDetails.startDate +
          "_" +
          fromToDetails.endDate +
          "_détaillé.csv",
        path: "output2.csv",
      },
    ],
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
