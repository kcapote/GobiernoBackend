const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var validRoles = {
    values: ['ADMINISTRADOR', 'CONSULTA', 'CARGA'],
    message: '{VALUE} no es un rol permitido'
}

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre del usuario es necesario"]
    },
    lastName: {
        type: String,
        required: [true, "El apellido del usuario es necesario"]
    },
    email: {
        type: String,
        required: [true, "El correo del usuario es necesario"]
    },
    password: {
        type: String,
        required: [true, "La contraseña del usuario es necesario"]
    },
    role: {
        type: String,
        required: true,
        default: 'CONSULTA',
        enum: validRoles
    }
});

UserSchema.plugin(uniqueValidator, { message: 'El correo {PATH} ya existe' });

const User = module.exports = mongoose.model('User', UserSchema);