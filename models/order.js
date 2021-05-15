const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [
        {
            product: { type: Object, required: true },
            quantity: [
                {
                    userQuantity: {
                        type: Number, required: true,
                    },
                    id: {
                        type: Schema.Types.ObjectId,
                    },
                    quantity: {
                        type: Number,
                    },
                    price: {
                        type: Number,
                    },
                    unit: {
                        type: Number,
                    },
                },
            ],
        }
    ],
    user: {
        email: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    address: {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipcode: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phonenumber: {
            type: Number,
            required: true
        }
    },
    status: {
        type: Boolean,
        required: true
    },
    orderRejected: {
        type: Boolean,
        required: true
    },
    orderCancelled: {
        type: Boolean,
        required: true
    },
    paymentId: {
        type: String,
        required: false
    },
    totalPrice: {
        type: Number,
        // required: true
    },
    paymentStatus: {
        type: Boolean,
        required: true
    }
},
    { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
