const mongoose = require('mongoose');

const NormaSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre de la norma es nesesario"]
    },
    description: {
        type: String,
        required: [true, "La descripción de la norma es nesesaria"]
    },
    version: {
        type: String,
        required: [true, "La versión de la norma es nesesaria"]
    },
    publicationDate: {
        type: String,
        required: [true, "El nombre de la norma es nesesario"]
    },
    linkFile: String,
    idFile: String
});

const Norma = module.exports = mongoose.model('Norma', NormaSchema);