//Require mongoose package
const mongoose = require('mongoose');

//Define CategoriaSchema with title, description and category
const CategoriaSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre de la Categoria es nesesario"]
    },
    description: String,
});

const Categoria = module.exports = mongoose.model('Categoria', CategoriaSchema);