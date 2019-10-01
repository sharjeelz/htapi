const mongoose = require('mongoose')


const PostTypeSchema = mongoose.Schema({

    ptype: {
        type: String,
        required: true
    }


})

module.exports = mongoose.model('PostType', PostTypeSchema)