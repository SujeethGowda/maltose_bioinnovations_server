const User = require('../models/user');
const Product = require('../models/product');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');
const { get } = require('mongoose');
const Order = require('../models/order');
const accountSid = 'AC6d4f842813ede63af57864d84183038d';
const authToken = '29ab86204bb94274a8d56f215f83c88c';
const client = require('twilio')(accountSid, authToken);

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key:
                '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'
        }
    })
);

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'thinkcode11@gmail.com',
        pass: 'xbhqazrooadjbipc'
    }
});

// var transporter =
//     nodemailer.createTransport({
//         service: 'gmail',
//         secure: false,
//         auth: {
//             user: 'thinkcode11@gmail.com',
//             pass: 'sujeeth7171'
//         },
//         tls: {
//             rejectUnauthorized: false
//         }
//     });

exports.postCart = async (req, res, next) => {
    var productList = [];
    const quantity = req.body.quantity;
    const prodId = req.body.productId;
    await User.findById({ _id: req.body.userId }).then(result => {
        Product.findById(req.body.productId)
            .then(product => {
                return result.addToCart(product, quantity, req.body.unit);
            })
            .then(async (result) => {
                var productIdList = [];
                productIdList = result.cart.items;
                for (var i = 0; i < productIdList.length; i++) {
                    await Product.findById(productIdList[i].productId).then(
                        result => {
                            var item = {
                                productDetails: result,
                                quantity: productIdList[i].quantity
                            }
                            productList.push(item);
                        }
                    )
                }
                res.status(201).json({
                    cart: productList,
                    message: "ADDED TO CART"
                });
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    })
};

exports.getCart = (req, res, next) => {
    console.log(req);
    var cartList = [];
    User.findById({ _id: req.params.userId }).then(async (result) => {
        var len = result.cart.items.length;
        var productListInCart = result.cart.items
        for (var i = 0; i < len; i++) {
            await Product.findById({ _id: result.cart.items[i].productId }).then(result => {
                var item = {
                    productDetails: result,
                    quantity: productListInCart[i].quantity
                }
                cartList.push(item);
            });
        }
        res.status(201).json({
            cart: cartList,
        });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.deleteItemFromCart = async (req, res, next) => {
    const prodId = req.body.productId;
    await User.findById({ _id: req.body.userId }).then(
        result => {
            result.removeFromCart(prodId).then(result => {
                res.status(201).json({
                    message: "DELETED FROM CART"
                });
            })
        }
    )
}

exports.getAddress = (req, res, next) => {
    User.findById({ _id: req.params.userid }).then(result => {
        res.status(201).json({
            address: result.orderAddress.addressList.reverse(),
        });
    });
}

exports.addNewAddress = (req, res, next) => {
    var phno = parseInt(req.body.contactnumber);
    User.findById({ _id: req.body.userId }).then(result => {
        result.addDeliveryAddress(req.body.name, req.body.address, req.body.street, req.body.state, req.body.zipcode, req.body.emailId, phno).then(result => {
            res.status(201).json({
                address: result.orderAddress.addressList.reverse(),
                message: "ADDED TO CART"
            });
        })
    });
}

exports.updateAddress = (req, res, next) => {
    var phno = parseInt(req.body.contactnumber);
    User.findById({ _id: req.body.userId }).then(result => {
        var address = result.orderAddress.addressList;
        for (var i = 0; i < address.length; i++) {
            if (address[i]._id == req.body._id) {
                address[i].name = req.body.name;
                address[i].address = req.body.address;
                address[i].state = req.body.state;
                address[i].zipcode = req.body.zipcode;
                address[i].email = req.body.emailId;
                address[i].phonenumber = phno;
            }
        }
        result.orderAddress.addressList = address;
        result.save().then(result => {
            res.status(201).json({
                address: result.orderAddress.addressList.reverse(),
                message: "ADDRESS EDITED"
            });
        })

    });
}

exports.postOrder = (req, res, next) => {
    var paymentStatusInfo;
    if (req.body.paymentId === null) {
        paymentStatusInfo = false;
    } else {
        paymentStatusInfo = true;
    }
    User.findById({ _id: req.body.userId }).then(
        result => {
            result.populate('cart.items.productId')
                .execPopulate()
                .then(user => {
                    addresses = user.orderAddress.addressList;
                    for (var i = 0; i < addresses.length; i++) {
                        if (addresses[i]._id == req.body.addressId) {
                            address = addresses[i];
                        }
                    }
                    const products = user.cart.items.map(i => {
                        return { quantity: i.quantity, product: { ...i.productId._doc } };
                    });
                    console.log(products);
                    const order = new Order({
                        user: {
                            email: result.email,
                            userId: result._id
                        },
                        address: {
                            name: address.name,
                            address: address.address,
                            state: address.state,
                            zipcode: address.zipcode,
                            email: address.email,
                            phonenumber: address.phonenumber
                        },
                        paymentId: req.body.paymentId,
                        products: products,
                        status: false,
                        paymentStatus: paymentStatusInfo,
                        orderRejected: false,
                        orderCancelled: false,
                        totalPrice: req.body.totalPrice,
                    });
                    return order.save();
                })
                .then(async (orderResult) => {
                    var productList = [];
                    var quantity;
                    var price;
                    
                    let mailDetails = {
                        from: 'thinkcode11@gmail.com',
                        to: 'sujeeth9171@gmail.com',
                        subject: 'Order placed',
                        html: `
                        <h1> New order has been placed </h1>
                        <p>${orderResult.address.name} has ordered products</p>
                        <p> ${orderResult.products[0].product.productName}</p>
                        <p> ${orderResult.products[0].quantity[0].quantity}</p>
                        <table>
                        <tr>
                            <th>Products</th>
                            <th>Quanity</th>
                            <th>Price</th>
                        </tr>
                        <tr>

        `
                    };
                    // <td>${orderResult[0].product.quantity[0].quantity}</td>
                    // <td>${orderResult[0].product.quantity[0].price}</td>
                    // <table>
                    //     <tr>
                    //         <th>Products</th>
                    //         <th>Quanity</th>
                    //         <th>Price</th>
                    //     </tr>
                    //     <tr>
                    //         <td>${orderResult[0].product.productName}</td>
                    //         <td>${orderResult[0].product.quantity[0].quantity}</td>
                    //         <td>${orderResult[0].product.quantity[0].price}</td>
                    //     </tr>
                    // </table>

                    await mailTransporter.sendMail(mailDetails, function (err, data) {
                        console.log("Came hre");
                        if (err) {
                            console.log(err);
                            console.log('Error Occurs');
                        } else {
                            console.log('Email sent successfully');
                        }
                    });

                    await transporter.sendMail({
                        to: 'sujeeth9171@gmail.com',
                        from: 'shop@node-complete.com',
                        subject: 'New Order',
                        html: `
        < h1 > There is a new order </h1 >
    <p>
        ${orderResult.address.name} has ordered products</p>
                         `
                    });
                    return result.clearCart();
                })
                .then(() => {
                    res.status(201).json({
                        message: "ORDER_CREATED"
                    });
                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                });
        }
    )
}

exports.getAllOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.params.userId }).then(
        result => {
            res.status(201).json({
                orders: result.reverse()
            });
        }
    )
}

exports.cancelOrder = async (req, res, next) => {
    console.log(req.body.id);
    Order.findById({ _id: req.body.id }).then(
        async (result) => {
            result.orderCancelled = true;
            await result.save().then(result => {
                res.status(201).json({
                    orders: result
                });
            })
        }
    )
}

exports.fieldVisitRequest = async (req, res, next) => {
    var phno = parseInt(req.body.contactnumber);
    const fieldvisitrequest = new FieldVist({
        name: title,
        phoneNumber: phno,
        requestDescription: imgUrl,
        zipcode: description,
        address: productType,
        lattitude: mrp,
        longitude: false,
    });
    fieldvisitrequest.save().then(result => {
        res.status(200).json({
            message: 'Request Raised Successfully'
        });
    })
}

exports.searchProduct = async (req, res, next) => {
    const searchField = req.query.searchvalue;
    Product.find({ productName: { $regex: searchField, $options: '$i' } }).then(data => {
        if (data.length != null) {
            res.status(200).json({
                message: 'Products',
                products: data
            });
        } else {
            res.status(200).json({
                message: 'No products found'
            });
        }

    })

}

exports.getWishlistProducts = async (req, res, next) => {
    console.log(req.params);
    var wishList = [];
    User.findById({ _id: req.params.userid }).then(async (result) => {
        var len = result.wishlist.length;
        var productListInCart = result.wishlist
        for (var i = 0; i < len; i++) {
            await Product.findById({ _id: result.wishlist[i].productId }).then(result => {
                wishList.push(result);
            });
        }
        console.log(wishList);
        res.status(201).json({
            wishlist: wishList,
        });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

}

exports.addToWishlist = async (req, res, next) => {
    console.log(req.body);
    var productList = [];
    User.findById({ _id: req.body.userId }).then(result => {
        Product.findById(req.body.productId)
            .then(product => {
                return result.addToWishlist(product);
            })
            .then(async (result) => {
                res.status(201).json({
                    wishlist: result,
                    message: "ADDED TO WISHLIST"
                });
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    })
}

exports.removeWishlistProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    User.findById({ _id: req.body.userId }).then(
        result => {
            result.removeFromWishlist(prodId).then(result => {
                res.status(201).json({
                    message: "DELETED FROM WISHLIST"
                });
            })
        }
    )
}