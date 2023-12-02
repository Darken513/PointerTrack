const express = require('express');
const controller = require('../controllers/api.controllerFirebase');

const router = express.Router();

router.get('/getAllVehicles', controller.getAllVehicles);
router.get('/getAllRestaurants', controller.getAllRestaurants);
router.get('/getAllUsers', controller.getAllUsers);
router.get('/getAllPointed/:restaurantId', controller.getAllPointed);
router.get('/getAllUnPointed', controller.getAllUnPointed);

router.post('/submit', controller.submit);
router.get('/selectedVehicle/:id/:vehicleId', controller.selectedVehicle);
router.post('/getAllFromTo', controller.getAllFromTo);

router.post('/createUser', controller.createUser);
router.post('/createRestaurant', controller.createRestaurant);
router.post('/createVehicle', controller.createVehicle);

router.get('/deleteRestaurantById/:restaurantId', controller.deleteRestaurantById);
router.get('/deleteUserById/:userId', controller.deleteUserById);
router.get('/deleteVehicleById/:vehicleId', controller.deleteVehicleById);

module.exports = router;