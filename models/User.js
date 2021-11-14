const mongoose = require('mongoose')

const UserShema=new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    date:{type:Date,default:Date.now},
    email:{type:String,required:true,unique:true}
})

module.exports = mongoose.model("User",UserShema)