const jwt = require('jsonwebtoken');

const rahasia = '1a2b3c4d5e';

const restrict = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("autheader:",authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log("token:", token);
    if(token == null) return res.sendStatus (401);
    jwt.verify(token, rahasia, (err, decoded)=> {
        console.log("err:",err);
        if(err) return res.sendStatus(403);
        req.email = decoded.email;
        next();
    }) 
}

module.exports = restrict;  
