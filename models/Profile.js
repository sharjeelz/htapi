const mongoose = require('mongoose')
var moment = require('moment')
const now = moment().format()

const profileSchema = mongoose.Schema({
    
    disease : {
        type: Array
    },
    maritalStatus: {type:String},
    createdAt: {
        type: String,
        default:now
    },
    updatedAt: {
        type: String,
    }
    
})

profileSchema.pre('findOneAndUpdate', function (next) {
    this.update({},{ $set: { updatedAt: now } });
    next()
  })

profileSchema.pre('update', function (next) {
    this.update({},{ $set: { updatedAt: now } });
    next()
  })

module.exports = mongoose.model('profile',profileSchema);