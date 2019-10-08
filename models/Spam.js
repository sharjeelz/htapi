const mongoose = require('mongoose')
var moment = require('moment')
const now = moment().format()

const spamSchema = mongoose.Schema({
    word : {type:String, required:true},
    frequency: {type:Number},
    createdAt: {
        type: String,
        default: now
    },
    updatedAt: {
        type: String,
    }

})
spamSchema.pre('findOneAndUpdate', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})

spamSchema.pre('update', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})

spamSchema.pre('findByIdAndUpdate', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})
module.exports = mongoose.model('spam',spamSchema);