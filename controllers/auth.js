module.exports.getLogin=(req,res)=>{
    res.render("login/login.ejs");
};
module.exports.getSignup=(req,res)=>{
    res.render("login/signup.ejs");
};
module.exports.postSignup=async(req,res)=>{
    let {username,email,password,name}=req.body;
    const newUser=new User({
        email:email,
        username:username,
        name:name,
    });
    const registeredUser=await User.register(newUser,password);
    res.send(registeredUser);
    };
module.exports.postLogin=async(req,res)=>{
        req.flash("success","Welcome");
        res.redirect("/pro");
    };