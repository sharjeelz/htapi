const mongoose = require('mongoose');


const UserSchema= mongoose.Schema({

    first_name: {
        type: String,
        required : true
    },
    last_name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required : false,
        unique:true
    },
    phone_number: {
        type: String,
        required : true
    },
    ip_address: {
        type: String,
        required : false
    },
    status: {
        type: Boolean,
        default :1
    },
    date: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required:true
    },
    gender: {
        type: String,
    }
   
})

module.exports= mongoose.model('Users',UserSchema);