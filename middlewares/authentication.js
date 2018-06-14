const constants = require('../config/constants');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.verifyToken = function(req, res, next) {
    var token = req.query.token;
    console.log(token);
    jwt.verify(token, constants.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Acceso Denegado',
                errors: err
            });
        }
        next();
    });
}

exports.refreshToken = function(req, res, next) {
    var token = req.query.token;
    let tokenInfo = jwt.decode(token);
    let generate = 0; //req.query.generate || 1;
    generate = Number(generate);
    console.log(token);
    User.findOne({ _id: tokenInfo.info }, (err, user) => {

        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Acceso Denegado',
                errors: err
            });
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Acceso Denegado',
                errors: err
            });
        }

        if (user.token != token) {
            return res.status(401).json({
                success: false,
                message: 'Acceso Denegado',
                errors: err
            });
        }

        if (generate > 0) {
            //crear un token
            var tokenNew = jwt.sign({ info: user._id }, constants.SEED, { expiresIn: constants.TIME_TOKEN_VALID }); // un año
            //ser guarda en BD el token del usuario activo
            user.token = tokenNew;
        }

        user.save((err, userSave) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Acceso Denegado',
                    errors: err
                });
            } else {
                userSave.password = '';
                req.user = userSave;
                console.log(userSave.token);
                next();
            }
        });
    });
}