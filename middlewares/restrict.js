const jwt = require('jsonwebtoken');

const rahasia = '1a2b3c4d5e';

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authorize based on user role
        (req, res, next) => {
            const authHeader = req.headers['authorization'];
                console.log('autheader:', authHeader);
            const token = authHeader && authHeader.split(' ')[1];
                console.log('token:', token);
            if (token == null) return res.sendStatus(401);
            jwt.verify(token, rahasia, (err, decoded) => {
                console.log('err:', err);
                if (err) return res.sendStatus(403);
                req.email = decoded.email;

                if (roles.length && !roles.includes(decoded.role)) {
                    // user's role is not authorized
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                next();
            })
        }
    ];
}
