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
    latitude: {
        type: String,
    },
    longitude: {
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
                quantity: [{
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
            },
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
    wishlist: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
        }
    ]

});

userSchema.methods.addToCart = async function (product, quantity, units) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    var addNewQuantity = 0;
    let newQuantity;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
        var q = parseInt(quantity);
        for (var i = 0; i < this.cart.items[cartProductIndex].quantity.length; i++) {
            console.log(this.cart.items[cartProductIndex].quantity[i]);
            if (units._id == this.cart.items[cartProductIndex].quantity[i].id) {
                newQuantity = this.cart.items[cartProductIndex].quantity[i].userQuantity + q;
                updatedCartItems[cartProductIndex].quantity[i].userQuantity = newQuantity;
                console.log(updatedCartItems[cartProductIndex].quantity.length);
                addNewQuantity = 1;
            }
        }
        if (addNewQuantity != 1) {
            await updatedCartItems[cartProductIndex].quantity.push(
                {
                    userQuantity: quantity,
                    id: units._id,
                    quantity: units.quantity,
                    price: units.price,
                    unit: units.unit
                }
            );
        }
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity:
                [{
                    userQuantity: quantity,
                    id: units._id,
                    quantity: units.quantity,
                    price: units.price,
                    unit: units.unit
                }]
        })
    }
    console.log('after');
    console.log(updatedCartItems);
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

userSchema.methods.addToWishlist = function (product) {
    console.log("From something");
    console.log(product);
    console.log(this.wishlist);
    const wishlistindex = this.wishlist.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    console.log("wishlistindex");
    console.log(wishlistindex);
    if (wishlistindex >= 0) {
        return wishlistItems;
    }

    console.log(wishlistindex);

    const wishlistItems = [...this.wishlist];
    wishlistItems.push({
        productId: product._id,
    })

    this.wishlist = wishlistItems;
    return this.save();
}

// userSchema.methods.removeFromWishlist = function (productId) {
//     const updatedWishlistItems = this.whishlist.filter(item => {
//         return item.productId.toString() !== productId.toString();
//     });
//     this.wishlist = updatedWishlistItems;
//     return this.save();
// };

module.exports = User = mongoose.model('user', userSchema)