const { validationResult } = require('express-validator');
const Feed = require('../models/feed');

exports.addNewPost = (req, res, next) => {
    const title = req.body.title;
    const postBody = req.body.postBody;

    const feed = new Feed({
        productName: title,
        feedDescription: postBody,
    });
    feed.save().then(result => {
        res.status(200).json({
            message: 'New Post Created Successfully'
        });
    })
}

exports.getAllPosts = (req, res, next) => {
    Feed.find().then(
        result => {
            var sortedResult = result.reverse();
            res.status(201).json({
                feeds: sortedResult
            });
        }
    )
}