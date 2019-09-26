const Joi = require('@hapi/joi');

//Register Validation 
const vErro = 'Validation Error';

const registerValidation = (req,res,next) => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        phone_number: Joi.number().required(),
        email: Joi.string().required().email().max(30),
        password: Joi.string().min(6).required(),
        repeat_password: Joi.ref('password'),
        gender: Joi.string()
    });
    const validataionHas = schema.validate(req.body);
    if (validataionHas.error) {
        return res.status(400).json({
            message : vErro,
            error: validataionHas.error.details[0].message
        });
         }
    next();
}

//Login Validation 

const loginValidation = (req,res,next) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required()
    });

    const validataionHas = schema.validate(req.body);
    if (validataionHas.error) {
        return res.status(400).json({
            message : vErro,
            error: validataionHas.error.details[0].message
        });
    }
    next();
}
const ForgotPasswordValidation = (req,res,next) => {
    const schema = Joi.object({
        phone_number: Joi.string().required()
    });
    const validataionHas  = schema.validate(req.body);
    if (validataionHas.error) {
        return res.status(400).json({
            message : vErro,
            error: validataionHas.error.details[0].message
        });
    }
    next();
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.forgotPasswordValidation = ForgotPasswordValidation;

