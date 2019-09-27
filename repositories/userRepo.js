
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const bcrypt = require('bcryptjs');
const dError = 'Data Error';
const eOpE= 'Password or email is wrong';
const eE= 'User Already Exists';
const fNf ='Phone Number Not Found';

const hashedpass = async (password)=> {
 /** hash the password */ 
 const salt = await bcrypt.genSalt(10);
 const hashedpassword = await bcrypt.hash(password, salt);
 return hashedpassword;
}
const authLogin = async (req, res, next) => {

    //check if user with this email  exists and active
    try {
        const user = await User.findOne({ email: req.body.email, status: 1 })
        .select('password utype')
        .populate('utype', 'utype');
        if (!user) {
            return res.status(400).json({
                message : dError,
                error: eOpE
            });
        }
        else {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            res.user_type = user.utype.utype;
            if (!validPassword) {
                return res.status(400).json({
                    message : dError,
                    error: eOpE
                });
            }
            next();
        }

    } catch (err) {
        console.log(err);
    }
}


const checkEmailPhone = async (req, res, next) => {
    //Get user by Id
    try {
        
        const emailExists = await User.findOne({$or:[{email: req.body.email},{phone_number:req.body.phone_number}]});
        if (emailExists) {
            return res.status(400).json({
                message : dError,
                error: eE
            })
        } else {
            next();
        }

    } catch (err) {
        console.log(err);
    }
}

const createRegisterEmail = (saveduser) => {

    let body = `<p><h2>Thank You, ${saveduser.first_name} ${saveduser.last_name} </h2> <hr/><p>We appriciate your effort towards a healthy community</p>`;
    let subject = 'Welcome to Healthtallk.com'
    let email = saveduser.email
    return { body: body, subject: subject, email: email }
};


const validPhone = (req,res,next)=> {

    User.findOne({phone_number:req.body.phone_number}).then(data=> {
        if(!data) {
            return res.status(404).json({
                message : dError,
                error: fNf
            })
        } else {
             res.datas = data;
            next();
        }
    })
    .catch(err=>{
        console.log(err);
    })

}

const verifyOtp = (req,res,next)=> {

    console.log(req.body);
}




module.exports.authLogin = authLogin;
module.exports.checkuserExists = checkEmailPhone;
module.exports.createRegisterEmail = createRegisterEmail;
module.exports.getHashedPassword = hashedpass;
module.exports.ValidatePhone = validPhone;
module.exports.verifyOtp = verifyOtp;

