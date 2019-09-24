
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const authLogin = async (email, password) => {
    //check if user with this email  exists and active
    try {
        const user = await User.findOne({ email: email,status:1 });
        if (!user) {
            return true;
        }
        else {
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return true;
            }
        }
    } catch (err) {
        console.log(err);
    }
}


const checkEmail = async (req,res,next) => {
    //Get user by Id
    try {
        const emailExists = await User.findOne({ email: req.body.email});
    if (emailExists) {
        return res.status(400).send('Email Already Exists');
    } else {
        next();
    }
    
    } catch (err) {
        console.log(err);
    }
}

const createRegisterEmail = (saveduser) => {

    let body= `<p><h2>Thank You, ${saveduser.first_name} ${saveduser.last_name} </h2> <hr/><p>We appriciate your effort towards a healthy community</p>`;
    let subject= 'Welcome to Healthtallk.com'
    let email= saveduser.email
    return  {body:body, subject: subject, email :email }
};

module.exports.checkEmail = authLogin;
module.exports.checkEmail = checkEmail;
module.exports.createRegisterEmail = createRegisterEmail;
