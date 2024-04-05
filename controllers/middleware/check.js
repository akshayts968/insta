const User=require("../../models/user.js");

module.exports.userCheck = (req, res, next) => {
    const userId = req.params.userId;
    if (res.locals.currUser && res.locals.currUser.equals(userId)) {
        return next();
    }
    res.redirect("/user");
};

module.exports.isLogin = (req, res, next) => {
    if (res.locals.currUser) {
        console.log(res.locals.currUser);
        return next();
    }
    res.redirect("/login");
};

module.exports.userIn = (req, res, next) => {
    if (res.locals.currUser) {
        return next();
    }
    res.redirect("/user");
};
module.exports.followCheck=async(req,res,next)=>{
    if(res.locals.currUser){
    let idToCheck=req.params.userId;
    const user = await User.findById(res.locals.currUser);
    const exists = user.followings.includes(idToCheck);
    res.locals.exists = exists;
    }
    next();
};
