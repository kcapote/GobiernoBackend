const mongoose = require('mongoose');

const StatsSchema = mongoose.Schema({
    page: {
        type: String
    },
    visit: {
        type: Number
    }
});

const Stats = module.exports = mongoose.model('Stats', StatsSchema);