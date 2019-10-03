const mongoose = require('mongoose')

const spamSchema = mongoose.Schema({
    word : {type:String, required:true},
    frequency: {type:Number}

})

module.exports = mongoose.model('spam',spamSchema);