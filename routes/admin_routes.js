const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const adminController = require('../controllers/admin_controller');

const router = express.Router();

router.post('/addproduct', adminController.addProduct);

router.get('/getorders', adminController.getOrders);

router.get('/getorderscompleted', adminController.getCompletedOrders);

router.get('/getfieldvisitrequests', adminController.getFieldVisitRequests);

router.get('/getfieldvisitrequestscompleted', adminController.getFieldVisitRequestsCompleted);

router.post('/addunits', adminController.addUnits);

module.exports = router;
