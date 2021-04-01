const { validationResult } = require('express-validator');
const User = require('../models/user');
const Product = require('../models/product');
const multer = require('multer');

var upload = multer({ dest: 'uploads/' })

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: 'add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

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
    console.log(req.body);

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
    const imgUrl = req.body.imageUrl;
    const product = new Product({
        productName: title,
        productPrice: price,
        productImageUrl: imgUrl,
        productDescription: description,
        productType: productType,
        productMrp: mrp,
        productOutOfStock: false,
    });
    product.save().then(result => {
        res.status(200).json({
            message: 'Product Added Successfully'
        });
    })
}