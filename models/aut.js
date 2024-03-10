const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
});
const Auth=mongoose.model("Auth",userSchema);
module.exports=Auth;