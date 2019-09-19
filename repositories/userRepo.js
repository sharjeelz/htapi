
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


const setStatus = async (id) => {
    //Get user by Id
    try {
        const user = await User.findOne({ _id: id});
        console.log(user);
    } catch (err) {
        console.log(err);
    }
}

module.exports.authLogin = authLogin;
module.exports.setStatus = setStatus;