const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedSchema = new Schema({
    feedTitle: {
        type: String,
        required: true
    },
    feedDescription: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model('Feed', feedSchema);