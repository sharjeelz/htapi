const mongoose = require('mongoose')
var moment = require('moment')
const now = moment().format()


const CommentSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    date: { type: String , default: now},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
})
module.exports = mongoose.model('Comment', CommentSchema)