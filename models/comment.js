const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    comment:{
        type:String,
        required:true,
    },
    owner:{
        type:String,
        required:true,
    },
    postOwner:{
        type:String,
        required:true,
    }
});
const Comment=mongoose.model("Comment",userSchema);
module.exports=Comment;