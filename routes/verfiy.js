const jwt = require('jsonwebtoken')
const getLocation = require('../functions/geoip')
const eE = 'Access Error'
const aD = 'Access Denied'
const iT = 'Invalid Token'


const adminAuth = (req, res, next) => {

    const token = req.header('ht-admin-token')
    if (!token) {
        return res.status(401).json({
            message: eE,
            error: aD
        })
    }

    try {

        const verified = jwt.verify(token, process.env.SECRETADMIN)
        req.user = verified
        next()

    } catch (error) {
        return res.status(400).json({
            message: eE,
            error: iT
        })
    }
}

const userAuth = (req, res, next) => {

    const token = req.header('htapi-token')
    if (!token) {
        return res.status(401).json({
            message: eE,
            error: aD
        })
    }

    try {

        const verified = jwt.verify(token, process.env.SECRET)
        req.user = verified
        next()

    } catch (error) {
        return res.status(400).json({
            message: eE,
            error: iT
        })
    }
}

const appAuth = (req, res, next) => {

    const my_location = process.env.ENV == 'development' ? getLocation('202.166.163.180') : getLocation(req.ip)
    if (my_location && my_location.country == 'PK') {
        next()
    }
    else {
        return res.send(`Note: Dear User From ${my_location.city},${my_location.country} :  This Application is Only For Pakistan <img src="/excdn/extras/pk.png"/> Only`)
    }
}

module.exports.adminAuth = adminAuth
module.exports.userAuth = userAuth
module.exports.AppAuth = appAuth