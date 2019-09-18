const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register',  (req, res) => {
    
    
    const newuser= new User({
        first_name: req.body.first_name,
        last_name:req.body.last_name,
        email : req.body.email,
        phone_number :req.body.phone_number,
        ip_address: req.ip
    });

   
    newuser.save().then((data)=>res.json(data))
    .catch(err=> res.json(err));
   
    
})

module.exports = router;