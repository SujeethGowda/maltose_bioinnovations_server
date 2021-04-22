const express = require('express');
var bodyparser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
var fs = require('fs');
const { validationResult } = require("express-validator");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const authRoutes = require('./routes/auth_routes');
const adminRoutes = require('./routes/admin_routes');
const productRoutes = require('./routes/product_routes');
const shopRoutes = require('./routes/shop_routes');
const fieldRoutes = require('./routes/field_visit_route');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/auth', authRoutes);
app.use('/product', productRoutes);
app.use('/admin', adminRoutes);
app.use('/shop', shopRoutes);
app.use('/field', fieldRoutes);

app.use((error, req, res, next) => {
    console.log('App ' + error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ error: message, data: data });
});


mongoose.connect('mongodb+srv://admin:jBqkkNke3LWa7Qmy@cluster0.fqgao.mongodb.net/maltosebioinnovation?retryWrites=true&w=majority').then(result => {
    app.listen(3000)
}).catch(err => console.log(err));