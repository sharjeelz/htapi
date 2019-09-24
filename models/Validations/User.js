const Joi = require('@hapi/joi');

//Register Validation 

const registerValidation = (req,res,next) => {
    const schema = Joi.object({
        first_name: Joi.string().required().max(10),
        last_name: Joi.string().required().max(10),
        phone_number: Joi.number().required(),
        email: Joi.string().required().email().max(30),
        password: Joi.string().min(6).required(),
        repeat_password: Joi.ref('password'),
        gender: Joi.string()
    });
    const validataionHas = schema.validate(req.body);
    if (validataionHas.error) {
             return res.status(400).send(validataionHas.error.details[0].message);
         }
    next();
}

//Login Validation 

const loginValidation = (req) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required()
    });
    return { error, data } = schema.validate(req);
}
const ForgotPasswordValidation = (req) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required(),
    });
    return { error, data } = schema.validate(req);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

