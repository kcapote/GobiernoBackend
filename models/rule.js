const mongoose = require('mongoose');

const RuleSchema = mongoose.Schema({
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
    creationDate: {
        type: Date,
        default: new Date()
    },
    updateDate: {
        type: Date
    },
    linkFile: String,
    idFile: String
});

const Rule = module.exports = mongoose.model('Rule', RuleSchema);