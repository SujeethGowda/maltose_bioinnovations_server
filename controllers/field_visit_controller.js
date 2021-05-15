const { validationResult } = require('express-validator');
const User = require('../models/user');
const FieldVist = require('../models/field_visit')

exports.fieldVisitRequest = async (req, res, next) => {
    var phno = parseInt(req.body.phoneNumber);
    var zipcode = parseInt(req.body.zipcode);
    const fieldvisitrequest = new FieldVist({
        userId: req.body.userId,
        userName: req.body.userName,
        phoneNumber: phno,
        requestDescription: req.body.requestDescription,
        zipcode: zipcode,
        visited: 0,
        address: req.body.address,
        lattitude: req.body.lattitude,
        longitude: req.body.longitude,
    });
    fieldvisitrequest.save().then(result => {
        res.status(200).json({
            message: 'Request Raised Successfully'
        });
    });
}