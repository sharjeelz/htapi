const jwt = require('jsonwebtoken')
const eE= 'Access Error'
const aD= 'Access Denied'
const iT= 'Invalid Token'


const adminAuth= (req,res,next) => {

    const token= req.header('ht-admin-token')
    if(!token) {
        return res.status(401).json({
            message : eE,
            error: aD
        })
    }

    try {

        const verified = jwt.verify(token,process.env.SECRETADMIN)
        req.user=verified
        next()
        
    } catch (error) {
        return res.status(400).json({
            message : eE,
            error: iT
        })
    }
}

const userAuth= (req,res,next) => {

    const token= req.header('htapi-token')
    if(!token) {
        return res.status(401).json({
            message : eE,
            error: aD
        })
    }

    try {

        const verified = jwt.verify(token,process.env.SECRET)
        req.user=verified
        next()
        
    } catch (error) {
        return res.status(400).json({
            message : eE,
            error: iT
        })
    }
}

module.exports.adminAuth = adminAuth
module.exports.userAuth = userAuth