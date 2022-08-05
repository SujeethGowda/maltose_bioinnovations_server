const { validationResult } = require('express-validator');
const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');
const FieldVisit = require('../models/field_visit');
const multer = require('multer');

var upload = multer({ dest: 'uploads/' })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'stall/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

exports.addProduct = async (req, res, next) => {
    // let upload = multer({ storage: storage }).array('product', 10);
    // await upload(req, res, function (err) {
    //     console.log(req.files);
    //     console.log(req.body);
    //     if (req.fileValidationError) {
    //         return res.send(req.fileValidationError);
    //     }
    //     else {
    //         const files = req.files;
    //         let index, len;
    //         var stallImagesArray = [];
    //         for (index = 0, len = files.length; index < len; ++index) {
    //             stallImagesArray.push(files[index].filename)
    //         }
    //         Stall.findById({ _id: req.body.stallId }).then(result => {
    //             console.log(result);
    //             console.log(stallImagesArray);
    //             if (result.stallImagesLinks.length === 0) {
    //                 result.stallImagesLinks = stallImagesArray;
    //             } else {
    //                 for (var i = 0; i < stallImagesArray.length; i++) {
    //                     result.stallImagesLinks.push(stallImagesArray[i]);
    //                 }
    //             }
    //             result.save().then(
    //                 result => {
    //                     res.status(200).json({
    //                         message: 'Uploaded Successfully',
    //                     });
    //                 }
    //             )
    //         })
    //     }
    // });
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const productType = req.body.productType;
    const mrp = req.body.mrp;
    const methodOfApplication = req.body.methodOfApplication;
    const imgUrl = req.body.imageUrl;
    const product = new Product({
        productName: title,
        productPrice: price,
        productImageUrl: imgUrl,
        productDescription: description,
        productMethodOfApplication: methodOfApplication,
        productType: productType,
        productMrp: mrp,
        productOutOfStock: false,
    });
    product.save().then(result => {
        Product.find().then(result => res.status(200).json({
            message: 'Product Added Successfully',
            products: result
        }));

    })
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

exports.getOrders = async (req, res, next) => {
    Order.find({ status: 0 }).then(
        result => {
            res.status(201).json({
                orders: result
            });
        }
    )
}

exports.getCompletedOrders = async (req, res, next) => {
    Order.find({ status: 1 }).then(result => {
        res.status(201).json({
            orders: result
        });
    })
}

exports.getFieldVisitRequests = async (req, res, next) => {
    FieldVisit.find({ visited: 0 }).then(result => {
        res.status(201).json({
            fieldvisits: result
        });
    });
}

exports.getFieldVisitRequestsCompleted = async (req, res, next) => {
    FieldVisit.find({ visited: 1 }).then(result => {
        res.status(201).json({
            fieldvisits: result
        });
    });
}

exports.addUnits = async (req, res, next) => {
    const quantity = parseInt(req.body.quantity);
    const price = parseInt(req.body.price);
    const units = req.body.unit;
    Product.findById({ _id: req.body.id }).then(result => {
        if (req.body.unitId == "") {
            result.units.push({ quantity: quantity, price: price, unit: units });
            result.save().then(result => {
                res.status(201).json({
                    product: result,
                    MESSAGE: "Added Succesfully",
                });
            }).catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
        } else {
            var unit = result.units;
            for (var i = 0; i < unit.length; i++) {
                if (unit[i]._id == req.body.unitId) {
                    unit[i].quantity = quantity;
                    unit[i].price = price;
                    unit[i].unit = units;
                }
            }
            result.units = unit;
            result.save().then(result => {
                res.status(201).json({
                    product: result,
                    MESSAGE: "Added Succesfully",
                });
            })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });
        }
    });
}

exports.deleteUnit = async (req, res, next) => {
    Product.findById({ _id: req.body.id }).then(result => {
        const updatedUnitItems = result.units.filter(item => {
            return item._id.toString() !== req.body.unitId.toString();
        });
        result.units = updatedUnitItems;
        result.save().then(result => {
            res.status(201).json({
                product: result,
                MESSAGE: "Added Succesfully",
            });
        })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    });
}

exports.updateProduct = async (req, res, next) => {
    console.log(req.body);
    Product.findById({ _id: req.body.id }).then(result => {
        console.log(result);
        result.productName = req.body.productName;
        result.productDescription = req.body.productDescription;
        result.productImageUrl = req.body.imageUrl;
        result.productMethodOfApplication = req.body.methodOfApplication;
        result.save().then(result => {
            Product.find().then(
                result => {
                    var sortedResult = result.sort();
                    res.status(201).json({
                        products: sortedResult
                    });
                }
            )
        })
    });
}

exports.deleteProduct = async (req, res, body) => {
    Product.deleteOne({ _id: req.params.productId }).then(result => {
        Product.find().then(
            result => {
                var sortedResult = result.sort();
                res.status(201).json({
                    products: sortedResult
                });
            }
        )
    });
}