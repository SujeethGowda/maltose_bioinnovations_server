const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const feedController = require('../controllers/feed_controller');

router.post('/addnewpost', feedController.addNewPost);

router.get('/getposts', feedController.getAllPosts);

module.exports = router;