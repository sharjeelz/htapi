const mongoose = require('mongoose')
var moment = require('moment')
const now = moment().format()

const profileSchema = mongoose.Schema({
    
    disease : {
        type: Array
    },
    date: {
        type: String,
        default:now
    }


})

module.exports = mongoose.model('profile',profileSchema);