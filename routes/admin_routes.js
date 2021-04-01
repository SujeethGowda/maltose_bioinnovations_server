const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const adminController = require('../controllers/admin_controller');

const router = express.Router();

// router.get('/', adminController.getLanding);

router.get('/addproduct', adminController.getAddProduct);

router.post('/addproduct',adminController.addProduct);

module.exports = router;
