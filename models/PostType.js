const mongoose = require('mongoose')


const PostTypeSchema = mongoose.Schema({

    ptype: {
        type: String,
        required: true
    }


})

PostTypeSchema.pre('findOneAndUpdate', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})

PostTypeSchema.pre('update', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})

PostTypeSchema.pre('findByIdAndUpdate', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})

module.exports = mongoose.model('PostType', PostTypeSchema)