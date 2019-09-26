const jwt = require('jsonwebtoken');


const O3Auth= (req,res,next) => {

    const token= req.header('htapi-token');
    if(!token) {
        return res.status(401).json({
            message : 'Access Error',
            error: 'Access Denied'
        });
    }

    try {

        const verified = jwt.verify(token,process.env.SECRET);
        req.user=verified;
        next();
        
    } catch (error) {
        return res.status(400).json({
            message : 'Access Error',
            error: 'Invalid Token'
        });
    }
}

module.exports= O3Auth;