const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../models/Validations/User');
const userType = require('../models/UserType');
const { authLogin, checkEmailExists,createRegisterEmail,getHashedPassword } = require('../repositories/userRepo');
const {registerEvent}= require('../Events/userEvents');

// Register New User
router.post('/register',[registerValidation,checkEmailExists], async (req, res) => {
    
   const ut_id = await userType.findOne({utype:'Admin'});

    /** Save the User */
    const newuser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        ip_address: req.ip,
        password:   await getHashedPassword(req.body.password),
        gender: req.body.gender,
        utype:ut_id._id
        
    });

    try {
        const saveduser = await newuser.save();
            
        const data = createRegisterEmail(saveduser);
        //registerEvent.emit('sendRegisteremail',data);
        //registerEvent.emit('sendRegistersms',saveduser);
        res.status(200).json({ user: saveduser._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

//Login User
router.post('/login',[loginValidation,authLogin], async (req, res) => {
    
    //creat token
    const token = jwt.sign({ email: req.body.email }, process.env.SECRET);
    res.header('htpai-token', token).json({ access_token: token});

});



//Forgot Password


module.exports = router;