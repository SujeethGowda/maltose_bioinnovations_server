const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    productOutOfStock: {
        type: Boolean,
        required: true
    },
    productType: {
        type: String,
        required: true
    },
    productImageUrl: {
        type: String,
        required: false
    },
    productPrice: {
        type: Number,
        required: true
    },
    productMrp: {
        type: Number,
        required: true
    },
    units: [{
        quantity: {
            type: Number,
        },
        price: {
            type: Number,
        },
        unit: {
            type: Number,
        }
    }],
    // userId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // }
});

module.exports = mongoose.model('Product', productSchema);