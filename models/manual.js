const mongoose = require('mongoose');

const ManualSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre de la manual es nesesario"]
    },
    description: {
        type: String,
        required: [true, "La descripción de la manual es nesesaria"]
    },
    version: {
        type: String,
        required: [true, "La versión de la manual es nesesaria"]
    },
    publicationDate: {
        type: String,
        required: [true, "El nombre de la manual es nesesario"]
    },
    linkFile: String,
    idFile: String
});

const Manual = module.exports = mongoose.model('Manual', ManualSchema);