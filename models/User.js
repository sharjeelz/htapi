const mongoose = require('mongoose')
var moment = require('moment')
const now = moment().format()

const UserSchema = mongoose.Schema({

    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        unique: true
    },
    phone_number: {
        type: String,
        required: true,
        unique: true
    },
    ip_address: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: 1
    },
    createdAt: {
        type: String,
        default: now
    },
    updatedAt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
    },
    utype: { type: mongoose.Schema.Types.ObjectId, ref: 'UserType' },
    location: { type: Array },
    others: { type: Array },
    pic : {type: String},
    profile:{ type: mongoose.Schema.Types.ObjectId, ref: 'profile' }
})

UserSchema.pre('findOneAndUpdate', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})

UserSchema.pre('update', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})

UserSchema.pre('findByIdAndUpdate', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})

module.exports = mongoose.model('User', UserSchema)