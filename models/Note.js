const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    noteId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },

    file: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Note", noteSchema);