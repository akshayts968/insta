const express=require("express");
const app=express();
const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/temperary";
const path=require("path");
const User=require("./models/user.js");
const Post=require("./models/post.js");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");

const flash=require("connect-flash");
const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge:7 * 24 * 60 * 60 *1000,
        htttpOnly:true,
    },
};
app.use(session(sessionOptions));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(express.static(path.join(__dirname,"/public")));
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});


main().then(()=>{
    console.log("conntected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}
app.get("/",(req,res)=>{
    res.send("Hi,I am root");
});
app.get("/form",(req,res)=>{
    res.render("form/form.ejs");
});
app.get("/user",wrapAsync(async(req,res)=>{
    const users = await User.find();
  res.render("user/main.ejs",{users});
}));
app.get('/user/:userId', async (req, res) => {
    try {
        // Fetch user data from the database
        const user = await User.findById(req.params.userId).populate("post");
        // Render user information in the view
        res.render("user/profile.ejs", { user });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/user/:userId/newpost', async (req, res) => {
    try { 
        let userId=req.params.userId;
        console.log(userId);
        // Fetch user data from the databas
        res.render('user/newpost.ejs',{userId});
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.post("/post/:id",async(req,res)=>{
    let id=req.params.id;
    console.log(id);
    const newPostData = {
        videourl: req.body.post
    };
    const newPost = new Post(newPostData);
    const user = await User.findById(id);
    /*const newpost = {
        newPost:req.body.post
    };
    const newPost = new Post(newpost);*/
    
    // Creating a new user instance
    await newPost.save();
    user.post.push(newPost._id);
    user.nPost++;
    await user.save();
    req.flash("success","New Post Created!");
    res.redirect(`/user/${id}`);
 });
 app.get('/use', async (req, res) => {
    res.render("user/profile.ejs");
});
 app.get('/user/:userId/change', async (req, res) => {
    try { 
        let userId=req.params.userId;
        // Fetch user data from the databas
        let id=req.params.userId;
    res.render("user/change.ejs",{id});
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
});
 app.get("/user/:id/change",async(req,res)=>{
    let {id}=req.params.id;
    console.log(req.body);
    res.send("s0");
    //res.render("user/change.ejs",id);

});
app.post("/user/:id/change",async(req,res)=>{
    let id=req.params.id;
   const user = await User.findByIdAndUpdate(
        id, // _id of the user
        { profile:req.body.post});
        await user.save();
    res.redirect("/user");

});
app.post("/form",async(req,res)=>{
   res.send(req.body); 
   const userData = {
    username: req.body.username,
    name: req.body.name,
    field: req.body.field
};
// Creating a new user instance
const newUser = new User(userData);

await newUser.save();
});
app.delete("/user/:userId/delete/:postId", async(req, res) => {
    let { userId, postId } = req.params;
    console.log(userId,postId);
    await User.findByIdAndUpdate(userId,{ $inc: { nPost: -1 } });
    await User.findByIdAndUpdate(userId,{$pull:{post:postId}});
    await Post.findByIdAndDelete(postId);
    res.redirect(`/user/${userId}`);
    // Add your delete logic here
});
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="PAGE NOT"}=err;
    res.status(statusCode).send(message);
    //res.status(statusCode).send(message);
    });
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});