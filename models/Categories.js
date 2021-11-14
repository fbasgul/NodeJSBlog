const mongoose = require('mongoose')

const CategoryShema=new mongoose.Schema({
    name:{type:String,required:true},
})

module.exports = mongoose.model("Categories",CategoryShema)