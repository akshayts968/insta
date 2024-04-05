const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const Post=require('./post');
const  passportLocalMongoose=require("passport-local-mongoose");

const newUser=new Schema({
    email:{
        type:String,
        required:true,
    },
    story:{
        type:String,
    },
    profile:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREUXDpKCAbTnzHHnmTP6JZc_rzytqcNO7_og&usqp=CAU",
        set:(v) =>
        v===""
        ?"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREUXDpKCAbTnzHHnmTP6JZc_rzytqcNO7_og&usqp=CAU"
        :v,
    },
    nPost:{
        type:Number,
        default:0
    },
    followers:[
        {
        type:String,
        }
    ],
    followings:[
        {
        type:String,
        }
    ],
    nFollowers:{
        type:Number,
        default:0
    },
    nFollowing:{
        type:Number,
        default:0
    },
    name:{
        type:String,
        required:true
    },
    field:{
        type:String,
    },
    post:[
        {
            type:Schema.Types.ObjectId,
            ref:"Post",
        }
    ]
});
newUser.plugin(passportLocalMongoose);

const User=mongoose.model("User",newUser);
module.exports=User;