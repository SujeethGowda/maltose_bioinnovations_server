const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed....');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const fullName = req.body.fullName;
    const phoneNumber = req.body.phoneNumber;
    User.findOne({ email: email }).then(
        result => {
            bcrypt.hash(password, 12)
                .then(hashedPw => {
                    const user = new User({
                        email: email,
                        password: hashedPw,
                        fullName: fullName,
                        phoneNumber: phoneNumber,
                        latitude:req.body.lat,
                        longitude: req.body.long,
                    });
                    return user.save();
                })
                .then(
                    result => {
                        result.verified = false;
                        result.save().then(result => {
                            const token = jwt.sign({
                                email: result.email,
                                userId: result._id.toString()
                            }, 'bestappintheworld', { expiresIn: '30d' }
                            );
                            res.status(201).json({
                                message: 'User Created',
                                userId: result,
                                token: token
                            });
                        })
                    }
                )
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });
            // }
        }
    )
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                loadedUser = user;
                return bcrypt.compare(password, user.password);
            } else {
                const error = new Error('EMAILID_NOT_FOUND');
                error.statusCode = 401;
                throw error;
            }
        })
        .then(
            isEqual => {
                if (!isEqual) {
                    const error = new Error('WRONG_PASSWORD');
                    error.statusCode = 401;
                    throw error;
                }
                const token = jwt.sign({
                    email: loadedUser.email,
                    userId: loadedUser._id.toString()
                }, 'bestappintheworld', { expiresIn: '30d' }
                );
                // loadedUser.latitude = 
                var decodedtoekn = jwt.decode(token);
                res.status(200).json({
                    token: token,
                    userId: loadedUser
                });
            })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}