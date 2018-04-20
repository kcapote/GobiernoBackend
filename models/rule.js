const mongoose = require('mongoose');
var Schema =	mongoose.Schema;

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
    category: { 
        type: Schema.Types.ObjectId,
        ref: 'Category'  
    },
    creationDate: {
        type: Date
    },
    updateDate: {
        type: Date
    },
    linkFile: String,
    idFile: String
});

const Rule = module.exports = mongoose.model('Rule', RuleSchema);