const mongoose = require('mongoose')

const userDetailSchema = new mongoose.Schema({
    val : { type : Number},
    name : { type : String},
    reviewers : { type : String},
    rating : { type : Number}
})

module.exports = mongoose.model('userdetail', userDetailSchema)