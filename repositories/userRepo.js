
const User = require('../models/User')
const PasswordReset = require('../models/PasswordReset')
const bcrypt = require('bcryptjs')
const dError = 'Data Error'
const eOpE = 'Password or email is wrong'
const eE = 'User Already Exists'
const fNf = 'Phone Number Not Found'
const uNf = 'User Not Found'
const iVu = 'Invalid User'

const hashedpass = async (password) => {
    /** hash the password */
    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(password, salt)
    return hashedpassword
}
const authLogin = async (req, res, next) => {

    //check if user with this email  exists and active
    try {
        const user = await User.findOne({ email: req.body.email, status: 1 })
            .select('password utype')
            .populate('utype', 'utype')
        if (!user) {
            return res.status(400).json({
                message: dError,
                error: eOpE
            })
        }
        else {
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            res.user_type = user.utype.utype
            if (!validPassword) {
                return res.status(400).json({
                    message: dError,
                    error: eOpE
                })
            }
            next()
        }

    } catch (err) {
        console.log(err)
    }
}


const checkEmailPhone = async (req, res, next) => {
    try {

        const emailExists = await User.findOne({ $or: [{ email: req.body.email }, { phone_number: req.body.phone_number }] })
        if (emailExists) {
            return res.status(400).json({
                message: dError,
                error: eE
            })
        } else {
            next()
        }

    } catch (err) {
        console.log(err)
    }
}

const createRegisterEmail = (saveduser) => {

    let body = `<p><h2>Thank You, ${saveduser.first_name} ${saveduser.last_name} </h2> <hr/><p>We appriciate your effort towards a healthy community</p>`
    let subject = 'Welcome to Healthtallk.com'
    let email = saveduser.email
    return { body: body, subject: subject, email: email }
}


const validPhone = async (req, res, next) => {

    await User.findOne({ phone_number: req.body.phone_number }).then(data => {
        if (!data) {
            return res.status(400).json({
                message: dError,
                error: fNf
            })
        } else {
            res.datas = data
            next()
        }
    })
        .catch(err => {
            console.log(err)
        })

}

const userExists = (req, res, next) => {

    const finduser = req.body.user ? req.body.user : req.params.user
    User.findById(finduser).then(user => {

        if (user) {
            res.datas = user
            next()
        } else {
            return res.status(400).json({
                message: dError,
                error: uNf
            })
        }

    }).catch(err => {

        return res.status(400).json({
            message: dError,
            error: iVu
        })
    })

}




module.exports.authLogin = authLogin
module.exports.checkuserExists = checkEmailPhone
module.exports.createRegisterEmail = createRegisterEmail
module.exports.getHashedPassword = hashedpass
module.exports.ValidatePhone = validPhone
module.exports.userExists = userExists

