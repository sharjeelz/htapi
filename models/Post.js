const mongoose = require('mongoose')
var moment = require('moment')
const now = moment().format()


const postSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    date: { type: String , default: now},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    posttype: { type: mongoose.Schema.Types.ObjectId, ref: 'PostType' },
    comments:[ {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
})
module.exports = mongoose.model('Post', postSchema)