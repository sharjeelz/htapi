const mongoose = require('mongoose')


const UserTypeSchema= mongoose.Schema({

    utype: {
        type: String,
        required : true
    }
    
   
})

module.exports= mongoose.model('UserType',UserTypeSchema)