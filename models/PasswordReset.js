const mongoose = require('mongoose');
var moment = require('moment');
const now = moment().format();
const expiry = moment().add('1','h').format();




const password_resetSchema = mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId,ref :'User'},
    code:{type:String},
    date: {type : String, default: now},
    expiry: {type:String, default: expiry}
})

module.exports = mongoose.model('reset_password',password_resetSchema);