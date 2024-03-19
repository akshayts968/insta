const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const Comment=require('./comment.js');
const post=new Schema({
    videourl:{
        type:String,
        default:"https://img.jagranjosh.com/imported/images/E/GK/sachin-records.png",
        set:(v) =>
        v===""
        ?"https://img.jagranjosh.com/imported/images/E/GK/sachin-records.png"
        :v,
    },
    nLikes:{
        type:Number,
        default:0
    },
    likes:[
        {
            type:String,
        }
    ],
    nComments:{
        type:Number,
        default:0
    },
    comments:[
        {
            type:Schema.Types.ObjectId,
            ref:"Comment",
        }
    ]
});
module.exports=mongoose.model("Post",post);