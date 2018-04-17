//Require mongoose package
const mongoose = require('mongoose');

//Define ElementSchema with title, description and category
const ElementSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    category: {
        type: String,
        required: true,
        enum: ['High', 'Medium', 'Low']
    }
});

const Elements = module.exports = mongoose.model('Elements', ElementSchema);

//Elements.find() returns all the lists
module.exports.getAllLists = (callback) => {
    Elements.find(callback);
}

//newList.save is used to insert the document into MongoDB
module.exports.addList = (newList, callback) => {
    newList.save(callback);
}

//Here we need to pass an id parameter to BUcketList.remove
module.exports.deleteListById = (id, callback) => {
    let query = { _id: id };
    Elements.remove(query, callback);
}