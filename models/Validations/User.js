const Joi = require('@hapi/joi');

//Register Validation 

const  registerValidation = (req) =>{
const schema = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    phone_number: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
    repeat_password: Joi.ref('password'),
    gender: Joi.string()
});
return  schema.validate(req);

}

//Login Validation 

const  loginValidation = (req) =>{
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required(),
       
    });
    
    return {error ,data} = schema.validate(req);
    }

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

