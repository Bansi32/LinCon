const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },

    about: {
        type: String,
        trim: true,
        required: true
    },

    location: {
        type: String,
        trim: true,
        required: true
    },

    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

const Community = mongoose.model('Community', communitySchema);
module.exports = Community;