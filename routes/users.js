const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../models/Validations/User');
const { authLogin, setStatus } = require('../repositories/userRepo');


// Register New User
router.post('/register', async (req, res) => {

    //validate the request data
    const validataionHas = registerValidation(req.body);
    if (validataionHas.error) {
        return res.status(400).send(validataionHas.error.details[0].message);
    }

    //check if user with this email already exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
        return res.status(400).send('Email Already Exists');
    }
    // hash the password and register the user        
    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(req.body.password, salt);

    const newuser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        ip_address: req.ip,
        password: hashedpass
    });

    try {
        const saveduser = await newuser.save();
        res.json({ user: saveduser._id });
    } catch (err) {
        res.status(400).send(err);
    }



});

//Login User
router.post('/login', async (req, res) => {
    //validate the request data
    const validataionHas = loginValidation(req.body);
    if (validataionHas.error) {
        return res.status(400).send(validataionHas.error.details[0].message);
    }

    loginAuth = await authLogin(req.body.email, req.body.password);
    if (loginAuth) {
        return res.send('Password or email is wrong');
    }

    //creat token
    const token = jwt.sign({email:req.body.email},process.env.SECRET);
    res.header('htpai-token',token).send(token);
    


});


module.exports = router;