const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const productController = require('../controllers/product_controller');

const router = express.Router();

router.get('/getproducts/:category', productController.getProducts);

router.get('/getallproducts', productController.getAllProducts);

module.exports = router;