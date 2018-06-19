const mongoose = require('mongoose');
var Schema =	mongoose.Schema;

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre de la Categoria es nesesario"]
    },
    description: String
});

const Category = module.exports = mongoose.model('Category', CategorySchema);