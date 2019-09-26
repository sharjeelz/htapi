const express = require('express');
const router = express.Router();
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation, forgotPasswordValidation} = require('../models/Validations/User');
const userType = require('../models/UserType');
const { authLogin, checkuserExists,createRegisterEmail,getHashedPassword, ValidatePhone } = require('../repositories/userRepo');
const {registerEvent}= require('../Events/userEvents');

// Register New User
router.post('/register',[registerValidation,checkuserExists], async (req, res) => {
     /** Save the User */
    const newuser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        ip_address: req.ip,
        password:   await getHashedPassword(req.body.password),
        gender: req.body.gender,
        utype:await userType.findOne({utype:'Public'})
    });
            await newuser
            .save()
            .then(saveduser=>{
                //const data = createRegisterEmail(saveduser);
                //registerEvent.emit('sendRegisteremail',data);
                //registerEvent.emit('sendRegistersms',saveduser); 
                res.status(201).json({
                    message: "User Created Successfuly",
                    data: {
                        user : {
                            _id: saveduser._id,
                            first_name: saveduser.first_name,
                            last_name: saveduser.last_name,
                            email: saveduser.email,
                            phone_number:saveduser.phone_number,
                            utype: saveduser.utype,
                            date: saveduser.date
                        },
                        response : {
                            type : 'POST',
                            url : 'http://'+req.headers.host+'/user/login',
                            params : {
                                "email" : "String",
                                "password" : "String"
                            }
                        }
                    }
                });
        })
            .catch(err=>{

                res.status(400).json({
                    message : "Data Error",
                    error : err.errmsg
                })
        })
    });

//Login User
router.post('/login',[loginValidation,authLogin], async (req, res) => {
    
    //creat token
    const token = jwt.sign({ email: req.body.email }, process.env.SECRET);
    res.header('htapi-token', token).json({
        message : "Login Successful",
        data : {
             access_token: token
        },
        meta : {
            "message" : "use the above token to access private resources"
        }
    });

});



//Forgot Password
router.post('/resetpassword',[ValidatePhone], async (req, res) => {

    //save in data base
    password_reset = new PasswordReset({
        user: res.datas._id,
        code : '1234'
    });
    await password_reset.save().then(data=>{
        res.status(200).json({
            message : "Code Successfuly Sent To your number",
            data: {
                code: data.code
            }
        })
    })

});

module.exports = router;