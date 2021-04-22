const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'I am new'
    },
    verified: {
        type: Boolean,
    },
    latitude:{
        type: String,
    },
    longitude:{
        type: String,
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: { type: Number, required: true }
            }
        ],
    },
    orderAddress:
    {
        addressList: [{
            name: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            },
            street: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            zipcode: {
                type: String,
                required: true
            },
            phonenumber: {
                type: Number,
                required: true
            },
            email: {
                type: String,
                required: true
            },
        },]
    },
});

userSchema.methods.addToCart = function (product, quantity) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        console.log(cp);
        console.log(product.id);
        return cp.productId.toString() === product._id.toString();
    });
    console.log(cartProductIndex);
    let newQuantity = quantity;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
        var q = parseInt(quantity);
        newQuantity = this.cart.items[cartProductIndex].quantity + q;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
};

userSchema.methods.addDeliveryAddress = function (name, address, street, state, zipcode, email, phonenumber) {
    const createOrderAddress = [...this.orderAddress.addressList];
    createOrderAddress.push({
        name: name,
        address: address,
        state: state,
        street: street,
        zipcode: zipcode,
        email: email,
        phonenumber: phonenumber,
    });
    const updatedCart = {
        addressList: createOrderAddress
    };
    this.orderAddress = updatedCart;
    return this.save();
};

userSchema.methods.updateDeliveryAddress = function (name, address, state, zipcode, emailId, phno, _id, latitude, longitude) {
    const updatedAddressList = this.orderAddress.addressList.filter(item => {
        if (item._id == _id) {
            return item;
        }
    });
    console.log(updatedAddressList);
    var item = updatedAddressList[0];
    item.name = name;
    item.address = address;
    item.state = state;
    item.street = street;
    item.zipcode = zipcode;
    item.email = emailId;
    item.phonenumber = phno;
    return item.save();
};

module.exports = mongoose.model('User', userSchema);