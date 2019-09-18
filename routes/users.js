const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt= require('jsonwebtoken');





// Register New User
router.post('/register',  (req, res) => {
    
    res.send(req.body.password);
    const newuser= new User({
        first_name: req.body.first_name,
        last_name:req.body.last_name,
        email : req.body.email,
        phone_number :req.body.phone_number,
        ip_address: req.ip,
        password:jwt.sign(req.body.password,'kwe')
    });

   
    newuser.save().then((data)=>res.json(data))
    .catch(err=> res.json(err));
   
    
});

router.get('/list',(req,res)=> {

    User.find({},(err ,users)=>{
        res.json(users);
    });
});

module.exports = router;