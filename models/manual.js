const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ManualSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre de la manual es nesesario"]
    },
    description: {
        type: String,
        required: [true, "La descripción del manual es nesesaria"]
    },
    version: {
        type: String
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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    file: {
        name: String,
        mimeType: String,
        doc: String
    },
    linkFile: String
});

const Manual = module.exports = mongoose.model('Manual', ManualSchema);