const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/temperary";
const path = require("path");
const User = require("./models/user.js");
const Post = require("./models/post.js");
const {Message, Conversation}=require("./models/message.js");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bodyParser = require("body-parser");
const Comment = require("./models/comment.js");
const { userCheck, isLogin, userIn, followCheck } = require('./controllers/middleware/check.js');
// Middleware to parse JSON bodies
app.use(bodyParser.json());
const flash = require("connect-flash");
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        htttpOnly: true,
    },
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "/public")));
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
const userRouter = require("./routes/user.js");
const loginRouter = require("./routes/log-sign.js");
app.use("/user", userRouter);

main().then(() => {
    console.log("conntected to DB");
})
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
};
app.get("/message",(req,res)=>{
res.render("message/message.ejs");
});
app.get("/m",(req,res)=>{
    res.render("message/m.ejs");
});
app.post("/m/me",async(req,res)=>{
const newMessage=new Message({
    sender:"65e1a495c70584ed53f70211",
    receiver:"65e1a495c70584ed53f70213",
    content:req.body.converstaion
});
let currUserId="65e1a495c70584ed53f70211";
let receiverId="65e1a495c70584ed53f70213";
console.log(req.body);
await newMessage.save();
const sortedParticipants = [currUserId, receiverId].sort();
console.log("sorted",sortedParticipants);
const existingConversation = await Conversation.findOne({
  participants: { $all: sortedParticipants }
});
  if(existingConversation){
    console.log( "this is",existingConversation);
    existingConversation.messages.push(newMessage._id);
    await existingConversation.save();
  }
  else{
    const sortedParticipants = [currUserId, receiverId].sort();
    const newConversation = new Conversation({
        participants:sortedParticipants,
        messages:[newMessage._id],
    });
    console.log(newConversation);
    await newConversation.save();
  }
  console.log(existingConversation);


});
app.get("/", (req, res) => {
    res.send("Hi,I am root");
});
app.get("/form", (req, res) => {
    res.render("form/form.ejs");
});
app.get("/u", wrapAsync(async (req, res) => {
    let users = await User.find().populate("post");
    let videos = await User.find({ story: { $exists: true, $ne: null } }, { story: 1, _id: 0 });
    console.log("videos are: ", videos);
    res.render("home/home.ejs", { users, videos });
}));
app.post("/updateDatabase", isLogin, wrapAsync(async (req, res) => {
    const commentText = req.body.comment;
    const postId = req.body.post;
    let postIdStr = postId.replace(/"/g, '').trim();
    try {
        const post = await Post.findById(postIdStr);
        console.log("post", post);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        const newComment = new Comment({
            comment: commentText,
            owner: res.locals.currUser._id || "UNKNOW",
            postOwner: postIdStr,
        });
        await newComment.save();
        post.comments.push(newComment._id);
        post.nComments++;
        await post.save();
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));
app.get('/fetch', async (req, res) => {
    try {
        // Example: Fetch data based on the query parameter 'q'
        const inputValue = req.query.q;
        // Use inputValue in your query to filter data accordingly
        let query = { username: { $regex: inputValue, $options: 'i' } };

        if (res.locals.currUser) {
            query._id = { $ne: res.locals.currUser };
        }

        const data = await User.find(query); res.json(data);
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
            console.log("Size of arr", inputArray.length);
            for (const comment of inputArray) {
                let comments = await Comment.findById(comment);
                console.log("comments are", comments);

                let user = await User.findById(comments.owner);
                console.log("user", user);

                const userDetails = {
                    userId: user._id || "fff",
                    profile: user.profile || "fff",
                    username: user.username || "fff",
                };

                comments = { ...comments.toObject(), userDetails };
                console.log("comments after update are", comments);

                data.push(comments);
                console.log("Data server ", data);
            }
            console.log("Data is in server ", data);
            res.json(data);
        }
        else {
            res.json("");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/user/:postId/:commentId', async (req, res) => {
    try {

        let { postId, commentId } = req.params;
        console.log(commentId, "welcome ", postId);
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


app.post("/post/:userId", userCheck, async (req, res) => {
    let userId = req.params.userId;
    const newPostData = {
        videourl: req.body.post
    };
    const newPost = new Post(newPostData);
    const user = await User.findById(userId);
    await newPost.save();
    user.post.push(newPost._id);
    user.nPost++;
    await user.save();
    req.flash("success", "New Post Created!");
    res.redirect(`/user/${userId}`);
});
app.get('/use', async (req, res) => {
    res.render("user/profile.ejs");
});
app.get('/pro', async (req, res) => {
    if (res.locals.currUser) {
        const user = await User.findById(res.locals.currUser).populate("post");
        res.locals.currUserPic = user.profile;
        return res.render("boiler/profile.ejs", { user });
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
/*app.get("/user/:id/change",async(req,res)=>{
   let {id}=req.params.id;
   console.log(req.body);
   res.send("s0");
   //res.render("user/change.ejs",id);

});*/
app.post("/form", async (req, res) => {
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
app.use("/", loginRouter);
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "PAGE NOT" } = err;
    res.status(statusCode).send(message);
    //res.status(statusCode).send(message);
});
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});