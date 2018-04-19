const mongoose = require('mongoose');

const CategoriaSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre de la Categoria es nesesario"]
    },
    description: String
});

const Categoria = module.exports = mongoose.model('Categoria', CategoriaSchema);