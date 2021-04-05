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



exports.postCart = (req, res, next) => {
    console.log(req.body);
    var productList = [];
    const quantity = req.body.quantity;
    const prodId = req.body.productId;
    User.findById({ _id: req.body.userId }).then(result => {
        Product.findById(req.body.productId)
            .then(product => {
                return result.addToCart(product, quantity);
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

exports.deleteItemFromCart = (req, res, next) => {
    const prodId = req.body.productId;
    User.findById({ _id: req.body.userId }).then(
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
                        products: products,
                        status: false,
                        paymentStatus: false,
                        orderRejected: false,
                        orderCancelled: false,
                        totalPrice: req.body.totalPrice,
                    });
                    return order.save();
                })
                .then(async (orderResult) => {
                    console.log(orderResult);
                    var oderedNumber = orderResult.address.phonenumber;
                    var oderPersonName = orderResult.address.name;
                    console.log(orderResult.address.name);
                    console.log(orderResult.address.phonenumber);
                    // var products = [];
                    // for (var i = 0; i < orderResult.products.length; i++) {
                    //     Products.findById({ '_id': rderResult.products._id }).then(
                    //         result => {
                    //             products.add(result.productName);
                    //         }
                    //     )
                    // }
                    var finalMessage = oderPersonName + " of " + oderedNumber + " ordered";
                    await client.messages
                        .create({
                            body: finalMessage,
                            from: 'whatsapp:+14155238886',
                            to: 'whatsapp:+917259511028'
                        })
                        .then(message => console.log(message.sid))
                        .done();
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