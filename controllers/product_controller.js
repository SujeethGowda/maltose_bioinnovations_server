const { validationResult } = require('express-validator');
const User = require('../models/user');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.find({ productType: req.params.category }).then(
        result => {
            var sortedResult = result.sort();
            res.status(201).json({
                products: sortedResult
            });
        }
    )
}

exports.getAllProducts = (req, res, next) => {
    Product.find().then(
        result => {
            var sortedResult = result.sort();
            res.status(201).json({
                products: sortedResult
            });
        }
    )
}