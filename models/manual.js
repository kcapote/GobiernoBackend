const mongoose = require('mongoose');
var Schema =	mongoose.Schema;

const ManualSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre de la manual es nesesario"]
    },
    description: {
        type: String,
        required: [true, "La descripción de la manual es nesesaria"]
    },
    creationDate: {
        type: Date
    },
    updateDate: {
        type: Date
    },
    category: { 
        type: Schema.Types.ObjectId,
        ref: 'Category'  
    },
    linkFile: String,
    idFile: String
});

const Manual = module.exports = mongoose.model('Manual', ManualSchema);