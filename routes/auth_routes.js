const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth_controllers');

const router = express.Router();

router.post('/signup',
[
    body('email')
    .isEmail()
    .withMessage('INVALID_EMAIL')
    .custom((value,{ req })=>{
        console.log(value);
        return User.findOne({email: value}).then(userDoc=>{
            if(userDoc){
                console.log(userDoc + 'im no heres');
                return Promise.reject('EMAIL_EXISTS');
            }
        });
    })
    .normalizeEmail(),
],
authController.signup);

router.post('/login',authController.login);

module.exports = router;