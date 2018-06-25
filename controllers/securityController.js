const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const constants = require('../config/constants');

router.post('/login', (req, res, next) => {

    if (req.body.email == null) {
        return res.status(400).json({
            success: false,
            message: 'Debe ingresar el correo para realizar el login',
            errors: { message: 'Debe ingresar el correo para realizar el login' }
        });
    }

    if (req.body.password == null) {
        return res.status(400).json({
            success: false,
            message: 'Debe ingresar la contraseña para realizar el login',
            errors: { message: 'Debe ingresar la contraseña para realizar el login' }
        });
    }

    User.findOne({ email: req.body.email }, (err, user) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Existen problemas en este momento, favor intente más tarde',
                errors: err
            });
        }

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y/o contraseña incorrecta',
                errors: { message: 'Usuario y/o contraseña incorrecta' }
            });
        }

        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y/o contraseña incorrecta',
                errors: { message: 'Usuario y/o contraseña incorrecta' }
            });
        }

        //crear un token
        user.password = '';
        var token = jwt.sign({ userToeken: user }, constants.SEED, { expiresIn: constants.TIME_TOKEN_VALID }); // un año
        res.status(201).json({
            success: true,
            message: 'Operación realizada de forma exitosa.',
            user: user,
            token: token
        });


    });

});



module.exports = router;