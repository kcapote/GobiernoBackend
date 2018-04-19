const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre de la Categoria es nesesario"]
    },
    description: String
});

const Category = module.exports = mongoose.model('Category', CategorySchema);