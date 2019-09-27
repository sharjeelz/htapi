const express = require('express');
const router = express.Router();
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation, forgotPasswordValidation} = require('../models/Validations/User');
const userType = require('../models/UserType');
const { authLogin, checkuserExists,createRegisterEmail,getHashedPassword, ValidatePhone, verifyOtp } = require('../repositories/userRepo');
const {userEvent}= require('../Events/userEvents');
var moment = require('moment');
const now = moment().format();
const expiry = moment().add('60','s').format();
const getLocation = require('../functions/geoip');
var useragent = require('express-useragent');


// Register New User
router.post('/register',[registerValidation,checkuserExists,useragent.express()], async (req, res) => {
        /** Get Location Params : TODO: see how req.ip will return data and then pass it to getLocation */ 
        const my_location= getLocation('202.166.163.180');
        /** Save the User */
        const newuser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        ip_address:  req.ip,
        password:   await getHashedPassword(req.body.password),
        gender: req.body.gender,
        utype:await userType.findOne({utype:'Public'}),
        location : [
            {country:my_location.country},
            {region:my_location.region},
            {city:my_location.city},
            {ll:my_location.ll},
            {timezone: my_location.timezone}

        ],
        others:{agent_data: req.useragent}
       
    });
            await newuser
            .save()
            .then(saveduser=>{
                const data = createRegisterEmail(saveduser);
                userEvent.emit('sendRegisteremail',data);
                //userEvent.emit('sendRegistersms',saveduser.phone_number,'Welcome to HT'); 

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
                        next : {
                            message: "Send the following Request to Login",
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
router.post('/resetpassword',[forgotPasswordValidation,ValidatePhone], async (req, res) => {

    //save in data base
    
    const respass = { 
        user: res.datas._id,
        code : genOtp(),
        date : now,
        expiry: expiry
     };
    await PasswordReset.findOneAndUpdate({user:res.datas._id},respass,{upsert:true}).then(response=>{
       
            //userEvent.emit('sendPasswordResetCode',res.datas.phone_number,'Your OTP is '+respass.code);
            res.status(200).json({
                message : "OTP Successfuly Sent",
                data: {
                    valid: 60,
                    resend :45,
                    reset_id : response._id
                },
                next : {
                    message : "Send the below Request to Verify OTP",
                    type : 'POST',
                    url :'http://'+req.headers.host+'/user/verifyotp',
                    params : {
                        "reset_id" : "String",
                        "code" :"String"
                    }
                }
            })
        });
    });

// verify OTP()
router.post('/verifyotp',(req,res)=>{
    PasswordReset.findOne({$and: [{_id:req.body.reset_id},{code:req.body.code}]}).then(data=>{
       
        if(!data) {

            return res.status(400).json({
                message : "Data Error",
                error : "Invalid OTP"
            })
        } else {
            return res.status(200).json({
                message : "Verified",
                data : {
                    user_id : data.user
                },
                next : {
                    message : "Send following Request to Set new Password",
                    type : "POST",
                    url : 'http://'+req.headers.host+'/user/changepassword',
                    params : {
                        "user_id": "String",
                        "password" : "String",
                        "confirm_password" : "String"

                    }
                }
            })

        }
       
    }).catch(err=>{
        console.log(err)
    })
});


//Change Password
router.post('/changepassword',async (req,res)=> {

    const hasp= await getHashedPassword(req.body.password);
    await User.findOneAndUpdate({_id:req.body.user_id},{password:hasp}).then(data=>{
        res.status(200).json({
            message : "Password Changed Successfully",
            next : {
                message  : "Yoo may ask user to sign in with new password now"
            }
        })
    }).catch(err=>{
        
        console.log(err);
    })

});
const genOtp= ()=> {return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);}

module.exports = router;