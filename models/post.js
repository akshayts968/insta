const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const post=new Schema({
    videourl:{
        type:String,
        default:"https://img.jagranjosh.com/imported/images/E/GK/sachin-records.png",
        set:(v) =>
        v===""
        ?"https://img.jagranjosh.com/imported/images/E/GK/sachin-records.png"
        :v,
    }
});
module.exports=mongoose.model("Post",post);