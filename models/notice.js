const mongoose = require('mongoose');
var Schema =	mongoose.Schema;

const NoticeSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "El titulo de la Noticia es nesesario"]
    },
    description: String,
    creationDate: {
        type: Date
    },
    updateDate: {
        type: Date
    },
    user: { 
        type: Schema.Types.ObjectId,
        ref: 'User'  
    }
});

const Notice = module.exports = mongoose.model('Notice', NoticeSchema);