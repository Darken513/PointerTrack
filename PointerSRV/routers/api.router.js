const express = require('express');
const controller = require('../controllers/api.controllerFirebase');

const router = express.Router();

router.get('/getAllRestaurants', controller.getAllRestaurants);
router.get('/getAllUsers', controller.getAllUsers);
router.get('/getAllPointed/:restaurantId', controller.getAllPointed);
router.get('/getAllUnPointed', controller.getAllUnPointed);
router.post('/submit', controller.submit);
router.post('/createUser', controller.createUser);
router.post('/createRestaurant', controller.createRestaurant);
router.post('/getAllFromTo', controller.getAllFromTo);
router.get('/deleteRestaurantById/:restaurantId', controller.deleteRestaurantById);
router.get('/deleteUserById/:userId', controller.deleteUserById);

module.exports = router;