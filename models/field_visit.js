const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fieldVisitSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    requestDescription: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    lattitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model('FieldVisit', fieldVisitSchema);