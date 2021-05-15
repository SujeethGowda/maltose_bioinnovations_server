const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const shopController = require('../controllers/shop_controller');

router.post('/addtocart', shopController.postCart);

router.get('/getcart/:userId', shopController.getCart);

router.get('/getaddresses/:userid', shopController.getAddress);

router.post('/addnewaddress', shopController.addNewAddress);

router.post('/updateaddress', shopController.updateAddress);

router.post('/deleteitemfromcart', shopController.deleteItemFromCart);

router.post('/postorder', shopController.postOrder);

router.get('/getorders/:userId', shopController.getAllOrders);

router.post('/ordercancel', shopController.cancelOrder);

router.get('/searchproduct',shopController.searchProduct);

module.exports = router;