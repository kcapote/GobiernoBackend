const constants = require('../config/constants');
const jwt = require('jsonwebtoken');

exports.verifyToken = function(req, res, next) {
    var token = req.query.token;
    jwt.verify(token, constants.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Acceso Denegado',
                errors: err
            });
        }
        req.user = decoded.user;
        next();
    });

}