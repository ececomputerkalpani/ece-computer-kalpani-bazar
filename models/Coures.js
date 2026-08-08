const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    duration: {
        type: String,
        required: true
    },

    fees: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Course", courseSchema);