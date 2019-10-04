const express = require('express')
const router = express.Router()
const User = require('../models/User')
const PasswordReset = require('../models/PasswordReset')
const jwt = require('jsonwebtoken')
const { registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation } = require('../models/Validations/User')
const userType = require('../models/UserType')
const { authLogin, checkuserExists,userExists, createRegisterEmail, getHashedPassword, ValidatePhone, verifyOtp } = require('../repositories/userRepo')
const { userEvent } = require('../Events/userEvents')
var moment = require('moment')
const now = moment().format()
const expiry = moment().add('60', 's').format()
const getLocation = require('../functions/geoip')
const useragent = require('express-useragent')
const config = require('../functions/config')
const myLogger = require('../functions/logger')
var multer = require('multer')
var upload = multer({ dest: 'uploads/profile' }).single('img')
const Profile = require('../models/Profile')

/** log User Module Actions : (WIP) */
//router.use(myLogger.userLogger)


// Register New User
router.post('/register', [registerValidation, checkuserExists, useragent.express()], async (req, res) => {
    /** Get Location  */

    let my_location = process.env.ENV == 'development' ? getLocation('202.166.163.180') : getLocation(req.ip)
    /** Save the User */
    const newuser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        ip_address: req.ip,
        password: await getHashedPassword(req.body.password),
        gender: req.body.gender,
        utype: await userType.findOne({ utype: 'Public' }),
        location: [
            { country: my_location.country },
            { region: my_location.region },
            { city: my_location.city },
            { ll: my_location.ll },
            { timezone: my_location.timezone }

        ],
        // others: { agent_data: req.useragent },
        /** TODO: Need to find out a way to upload pic either from node or from front end using aws.. or others */
        pic: 'http://portfolio.sharjeelz.com/wp-content/uploads/2018/12/12193500_1637646209856358_6420604699381433064_n.jpg',
        profile: await new Profile({}).save()

    })
    await newuser
        .save()
        .then(saveduser => {
            //const data = createRegisterEmail(saveduser)
            //userEvent.emit('sendRegisteremail',data)
            //userEvent.emit('sendRegistersms',saveduser.phone_number,'Welcome to HT') 

            res.status(201).json({
                message: "User Created Successfuly",
                data: {
                    user: {
                        _id: saveduser._id,
                        first_name: saveduser.first_name,
                        last_name: saveduser.last_name,
                        email: saveduser.email,
                        phone_number: saveduser.phone_number,
                        utype: saveduser.utype,
                        date: saveduser.date
                    }
                }
            })
        })
        .catch(err => {

            res.status(400).json({
                message: "Data Error",
                error: err.errmsg
            })
        })
})

//Login User
router.post('/login', [loginValidation, authLogin], async (req, res) => {

    /** creat  Admin token */
    if (res.user_type == 'Admin') {
        const token = jwt.sign({ email: req.body.email }, process.env.SECRETADMIN)
        res.header('ht-admin-token', token).json({
            message: "Admin Login Successful",
            data: {
                access_token: token
            },
            meta: {
                "message": "use the above token to access admin resources"
            }
        })
    }
    /** creat  user token */
    else {
        const token = jwt.sign({ email: req.body.email }, process.env.SECRET)
        res.header('htapi-token', token).json({
            message: "Login Successful",
            data: {
                access_token: token
            },
            meta: {
                "message": "use the above token to access private resources"
            }
        })
    }
})



//Forgot Password
router.post('/resetpassword', [forgotPasswordValidation, ValidatePhone], async (req, res) => {
    const respass = {
        user: res.datas._id,
        code: genOtp(),
        date: now,
        expiry: expiry
    }

    await PasswordReset.findOneAndUpdate({ user: res.datas._id }, respass, { upsert: true }).then(response => {

        //userEvent.emit('sendPasswordResetCode',res.datas.phone_number,'Your OTP is '+respass.code)
        res.status(200).json({
            message: "OTP Successfuly Sent",
            data: {
                valid: config.otpexpiry,
                resend: config.otpresendtimedelay,
                reset_id: response._id
            }
        })
    })
})

// verify OTP()
router.post('/verifyotp', (req, res) => {
    PasswordReset.findOne({ $and: [{ _id: req.body.reset_id }, { code: req.body.code }] }).then(data => {

        if (!data) {

            return res.status(400).json({
                message: "Data Error",
                error: "Invalid OTP"
            })
        } else {
            if (data.expiry > now) {
                return res.status(200).json({
                    message: "Verified",
                    data: {
                        user_id: data.user
                    }
                })
            } else {

                return res.status(400).json({
                    message: "Data Error",
                    error: "OTP Expired"
                })
            }

        }

    }).catch(err => {
        console.log(err)
    })
})


//Change Password
router.post('/changepassword', resetPasswordValidation, async (req, res) => {

    const hasp = await getHashedPassword(req.body.password)
    await User.findOneAndUpdate({ _id: req.body.user_id }, { password: hasp }).then(data => {
        res.status(200).json({
            message: "Password Changed Successfully"
        })
    }).catch(err => {

        console.log(err)
    })

})

// add profile image
router.post('/image', (req, res) => {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
        } else if (err) {
            console.log(err);
        }

        console.log(req.file);
    })
})

// create profile
router.post('/profile', [userExists], (req, res) => {

    /** 
     {  
	"data" : [{"prop":"disease","value": ["asthama","polio"]}]
    }
     */
    const updateOps = {}
    for (const ops of req.body.data) {
        updateOps[ops.prop] = ops.value
    }
    Profile.findOneAndUpdate({_id:res.datas.profile}, { $set: updateOps }).then(data => {
            res.status(200).json({
                message: "Profile Updated"
            })
        }).catch(err => {
            console.log(err);
        })
    })

//get user profile

router.get('/profile/:user',[userExists], (req, res) => {
   Profile.findById(res.datas.profile).then(data => {
            res.status(200).json({
                message: "Profile Fetched",
                data: {
                    profile: data
                }
            })
        }).catch(err => {
            console.log(err);
        })

   
})

const genOtp = () => { return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1) }

module.exports = router