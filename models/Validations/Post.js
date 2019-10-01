const Joi = require('@hapi/joi')
const vErro = 'Validation Error'


const createPost  = (req,res,next)=> {

    const schema = Joi.object({
        message: Joi.string().required(),
        user: Joi.string().required(),
        ptype: Joi.string().required()
    })
    const validataionHas = schema.validate(req.body)
    if (validataionHas.error) {
        return res.status(400).json({
            message: vErro,
            error: validataionHas.error.details[0].message
        })
    }
    next()
}


const updatePost  = (req,res,next)=> {

    const schema = Joi.object({
        data: Joi.array().required()
    })
    const validataionHas = schema.validate(req.body)
    if (validataionHas.error) {
        return res.status(400).json({
            message: vErro,
            error: validataionHas.error.details[0].message
        })
    }
    next()
}

const idValidation  = (req,res,next)=> {

    const schema = Joi.object({
        id: Joi.string().required()
    })
    const validataionHas = schema.validate(req.body)
    if (validataionHas.error) {
        return res.status(400).json({
            message: vErro,
            error: validataionHas.error.details[0].message
        })
    }
    next()
}

module.exports.createPostValidation = createPost
module.exports.updatePostValidation = updatePost





