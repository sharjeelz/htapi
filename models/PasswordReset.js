const mongoose = require('mongoose')
var moment = require('moment')
const now = moment().format()
const expiry = moment().add('60', 's').format()



const password_resetSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    code: { type: String },
    createdAt: {
        type: String,
        default: now
    },
    updatedAt: {
        type: String,
    },
    expiry: { type: String, default: expiry }
})


password_resetSchema.pre('findOneAndUpdate', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})

password_resetSchema.pre('update', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})

password_resetSchema.pre('findByIdAndUpdate', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})
module.exports = mongoose.model('reset_password', password_resetSchema)