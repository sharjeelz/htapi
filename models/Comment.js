const mongoose = require('mongoose')
var moment = require('moment')
const now = moment().format()


const CommentSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: now
    },
    updatedAt: {
        type: String,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

CommentSchema.pre('findOneAndUpdate', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})

CommentSchema.pre('update', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})

CommentSchema.pre('findByIdAndUpdate', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})
module.exports = mongoose.model('Comment', CommentSchema)