const jwt = require('jsonwebtoken');


const O3Auth= (req,res,next) => {

    const token= req.header('htapi');
    if(!token) {
        return res.status(401).send('Access Denied');
    }

    try {

        const verified = jwt.verify(token,process.env.SECRET);
        req.user=verified;
        next();
        
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}

module.exports= O3Auth;