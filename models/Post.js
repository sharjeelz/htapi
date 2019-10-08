const mongoose = require('mongoose')
var moment = require('moment')
const now = moment().format()


const postSchema = mongoose.Schema({
    message: {
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
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    posttype: { type: mongoose.Schema.Types.ObjectId, ref: 'PostType' },
    comments:[ {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
})

postSchema.pre('findOneAndUpdate', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})

postSchema.pre('update', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})

postSchema.pre('findByIdAndUpdate', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})
module.exports = mongoose.model('Post', postSchema)