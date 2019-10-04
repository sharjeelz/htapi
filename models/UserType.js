const mongoose = require('mongoose')


const UserTypeSchema = mongoose.Schema({

    utype: {
        type: String,
        required: true
    }


})
UserTypeSchema.pre('findOneAndUpdate', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})

UserTypeSchema.pre('update', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})

UserTypeSchema.pre('findByIdAndUpdate', function (next) {
    this.update({}, { $set: { updatedAt: now } });
    next()
})
module.exports = mongoose.model('UserType', UserTypeSchema)