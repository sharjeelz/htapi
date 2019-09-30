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
    date: {
        type: String,
        default: now
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
    pic : {type: String}
})

module.exports = mongoose.model('User', UserSchema)