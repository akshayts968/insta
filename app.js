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
const passport=require("passport");
const LocalStrategy=require("passport-local");
const Auth=require("./models/aut.js");
const bodyParser = require("body-parser");
const Comment=require("./models/comment.js");
// Middleware to parse JSON bodies
app.use(bodyParser.json());
const userCheck=(req,res,next)=>{
    const userId = req.params.userId;
if(res.locals.currUser&&res.locals.currUser.equals(userId))
{
   return next();
}
res.redirect("/user");
};
const isLogin=(req,res,next)=>{
if(res.locals.currUser)
{   console.log(res.locals.currUser);
     return next();
}
res.redirect("/login");
};
const userIn=(req,res,next)=>{
if(res.locals.currUser)
{
   return next();
}
res.redirect("/user");
};
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
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname,"/public")));
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");   
    res.locals.currUser=req.user;
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

app.get("/f",async(req,res)=>{
    try {
        // Update multiple users
        const updatedUsers = await User.updateMany(
          { _id: { $in: ['65e1a47dc70584ed53f70211','65e1a495c70584ed53f70213','65e282d6933a8f9159e40acf','65e2d2ee588532f216c911b9','65e469595a685ab1006c1c79','65e472e1a2a8996e24a5c6e6'] } },
          {
            $set: {
              followers: [],
              followings: [],
              nFollowers: 0,
              nFollowing: 0,
              // Add any other missing fields here
            }
          },
          { new: true } // Return the updated documents
        );
    
        console.log('Updated users:', updatedUsers);
      } catch (error) {
        console.error('Error updating users:', error);
      }
});
app.get("/fg",async(req,res)=>{
    try {
        const update = {
            $set: {
                nLikes: 0, // Default value for nLikes
                likes: [], // Default value for likes
                nComments: 0, // Default value for nComments
                comments: [] // Default value for comments
            }
        };
    
        // Update all documents in the collection
        const result = await Post.updateMany({}, update);
    
        console.log('Documents updated successfully:', result);
    } catch (error) {
        console.error('Error updating documents:', error);
    }
});

app.get("/login",(req,res)=>{
res.render("login/login.ejs");
});
app.get("/signup",(req,res)=>{
    res.render("login/signup.ejs");
    });
app.post("/signup",async(req,res)=>{
let {username,email,password,name}=req.body;
const newUser=new User({
    email:email,
    username:username,
    name:name,
});
const registeredUser=await User.register(newUser,password);
res.send(registeredUser);
});


app.post("/login",passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,}),
    async(req,res)=>{
        req.flash("success","Welcome");
        res.redirect("/pro");
    });
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

app.get("/u",wrapAsync(async(req,res)=>{
let users = await User.find().populate("post");
let videos=await User.find({ story: { $exists: true, $ne: null } }, { story: 1, _id: 0 });
console.log("videos are: ",videos);
  res.render("home/home.ejs",{users,videos});
}));

app.post("/updateDatabase", isLogin, wrapAsync(async (req, res) => {
    const commentText = req.body.comment;
    const postId = req.body.post;
    let postIdStr = postId.replace(/"/g, '').trim();
    
    try {
        // Find the post by its ID
        const post = await Post.findById(postIdStr);
        console.log("post",post);
        if (!post) {
            // If the post is not found, return an error response
            return res.status(404).send("Post not found");
        }

        // Create a new Comment instance
        const newComment = new Comment({
            comment: commentText,
            owner: res.locals.currUser._id||"UNKNOW",
            postOwner: postIdStr,
        });

        // Save the new comment
        await newComment.save();

        // Update the post with the new comment ID and increment nComments
        post.comments.push(newComment._id);
        post.nComments++;

        // Save the updated post
        await post.save();

        // Send a success response
        res.sendStatus(200);
    } catch (error) {
        // If an error occurs, return a 500 Internal Server Error response
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));



const followCheck=async(req,res,next)=>{
    if(res.locals.currUser){
    let idToCheck=req.params.userId;
    const user = await User.findById(res.locals.currUser);
    const exists = user.followings.includes(idToCheck);
    res.locals.exists = exists;
    }
    next();
};


app.get('/user/:userId/followers',followCheck,async (req, res) => {
    try {
        // Fetch user data from the database
        const user = await User.findById(req.params.userId).populate("post");
        // Render user information in the view
        const followers = user.followers;
        let followData=[];
        for (const followerId of followers) {
        const follower = await User.findById(followerId);
        followData.push(follower);
        }
        const follow=true;
        res.render("boiler/followers.ejs", { user,followData, exists: res.locals.exists,follow });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/user/:userId/followings',followCheck,async (req, res) => {
    try {
        // Fetch user data from the database
        const user = await User.findById(req.params.userId).populate("post");
        // Render user information in the view
        const followings = user.followings;
        let followData=[];
        for (const followingId of followings) {
        const follower = await User.findById(followingId);
        followData.push(follower);
        }
        const follow=false;
        res.render("boiler/followers.ejs", { user,followData, exists: res.locals.exists,follow });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/user/:userId/story',isLogin,async (req, res) => {
    try {
        // Fetch user data from the database
        console.log(req.params);
        const user = await User.findById(req.params.userId);
        // Render user information in the view
        user.story=req.body.story;
        await user.save();
        res.send(typeof req.body.story);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/user/:userId',followCheck,async (req, res) => {
    try {
        // Fetch user data from the database
        const user = await User.findById(req.params.userId).populate("post");
        // Render user information in the view
        res.render("boiler/profile.ejs", { user, exists: res.locals.exists||false});
        } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.post("/user/:userId",isLogin,async(req,res)=>{
    try {
    let userId=req.params.userId;
    const user = await User.findById(userId);
    let currId=res.locals.currUser._id;
    const currUser=await User.findById(currId);
    if(!user.followers.includes(currId)){
        user.followers.push(currId);
        user.nFollowers++;
        currUser.followings.push(userId);
        currUser.nFollowing++;
        await user.save();
        await currUser.save();
        res.redirect(`/user/${userId}`);
    }
    else {
        res.status(400).send("You are already following this user.");
    }
    } catch (error) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }});
app.delete('/user/:userId',followCheck,async (req, res) => {
        try {
            if(res.locals.exists){
                let userId=req.params.userId;
                let currId=res.locals.currUser._id;
                const currUser = await User.findByIdAndUpdate(currId, {
                    $pull: { followings: userId },
                    $inc: { nFollowing: -1 }
                });
        
                // Remove currUserId from the followings array of user
                const user = await User.findByIdAndUpdate(userId, {
                    $pull: { followers: currId },
                    $inc: { nFollowers: -1 }
                });
                res.redirect(`/user/${userId}`);

            }
        }catch (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Internal Server Error');
        }
});
app.get('/user/:userId/newpost', userCheck,async (req, res) => {
    try { 
        if(!req.isAuthenticated())
        {
            res.redirect("/login");
        }
        let userId=req.params.userId;
        console.log(userId);
        // Fetch user data from the databas
        res.render('user/newpost.ejs',{userId});
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/fetch', async (req, res) => {
    try {
        // Example: Fetch data based on the query parameter 'q'
        const inputValue = req.query.q;
        // Use inputValue in your query to filter data accordingly
        let query = { username: { $regex: inputValue, $options: 'i' } };

        if (res.locals.currUser) {
            query._id = { $ne: res.locals.currUser };
        }
        
        const data = await User.find(query);        res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app.get('/fetchcomment', async (req, res) => {
    try {
        // Example: Fetch data based on the query parameter 'q'
        const inputValue = req.query.q;
        if (inputValue.length != 0) {
        console.log("input array", inputValue);
        const inputArray = inputValue.split(',');
        
        let data = [];
        console.log("Size of arr",inputArray.length);
        for (const comment of inputArray) {
            let comments = await Comment.findById(comment);
            console.log("comments are", comments);
            
            let user = await User.findById(comments.owner);
            console.log("user", user);
            
            const userDetails = {
                userId: user._id||"fff",
                profile: user.profile||"fff",
                username: user.username||"fff",
            };
            
            comments = { ...comments.toObject(), userDetails };
            console.log("comments after update are", comments);
            
            data.push(comments);
            console.log("Data server ", data);
        }
        console.log("Data is in server ", data);
        res.json(data);
    }
    else{
        res.json("");
    }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/user/:postId/:commentId',async(req,res)=>{
    try {
        
        let { postId,commentId } = req.params;
        console.log(commentId,"welcome ",postId);
        await Comment.findByIdAndDelete(commentId);
        await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } });
        res.send(req.params);
        //res.status(200).send('Comment deleted successfully');
    } catch (error) {
        // Handle errors appropriately
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


app.post("/post/:userId",userCheck,async(req,res)=>{
    let userId=req.params.userId;
    const newPostData = {
        videourl: req.body.post
    };
    const newPost = new Post(newPostData);
    const user = await User.findById(userId);
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
    res.redirect(`/user/${userId}`);
 });
 app.get('/use', async (req, res) => {
    res.render("user/profile.ejs");
});
app.get('/pro',async (req, res) => {
    if(res.locals.currUser)
    {   
        const user = await User.findById(res.locals.currUser).populate("post");
        res.locals.currUserPic=user.profile;
        return res.render("boiler/profile.ejs", { user});
    }
    res.redirect("/user");
        // Render user information in the view
});
app.get('/home', async (req, res) => {
    res.render("boiler/sidenav.ejs");
});
app.get('/homes', async (req, res) => {
    res.render("boiler/profile.ejs");
});
 app.get('/user/:userId/change',userCheck,async (req, res) => {
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
app.delete("/user/:userId/delete/:postId",userCheck, async(req, res) => {
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