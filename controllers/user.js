const User = require("../models/user.js");
const Post = require("../models/post.js");
module.exports.followers = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate("post");
        const followers = user.followers;
        let followData = [];
        for (const followerId of followers) {
            const follower = await User.findById(followerId);
            followData.push(follower);
        }
        const follow = true;
        res.render("boiler/followers.ejs", { user, followData, exists: res.locals.exists, follow });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
};
module.exports.followings = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate("post");
        const followings = user.followings;
        let followData = [];
        for (const followingId of followings) {
            const follower = await User.findById(followingId);
            followData.push(follower);
        }
        const follow = false;
        res.render("boiler/followers.ejs", { user, followData, exists: res.locals.exists, follow });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
};
module.exports.story = async (req, res) => {
    try {
        console.log(req.params);
        const user = await User.findById(req.params.userId);
        user.story = req.body.story;
        await user.save();
        res.send(typeof req.body.story);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
};
module.exports.showUser = async (req, res) => {
    try {
        // Fetch user data from the database
        const user = await User.findById(req.params.userId).populate("post");
        // Render user information in the view
        res.render("boiler/profile.ejs", { user, exists: res.locals.exists || false });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
};
module.exports.postUser = async (req, res) => {
    try {
        let userId = req.params.userId;
        const user = await User.findById(userId);
        let currId = res.locals.currUser._id;
        const currUser = await User.findById(currId);
        if (!user.followers.includes(currId)) {
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
    }
};
module.exports.deleteUser = async (req, res) => {
    try {
        if (res.locals.exists) {
            let userId = req.params.userId;
            let currId = res.locals.currUser._id;
            const currUser = await User.findByIdAndUpdate(currId, {
                $pull: { followings: userId },
                $inc: { nFollowing: -1 }
            });
            const user = await User.findByIdAndUpdate(userId, {
                $pull: { followers: currId },
                $inc: { nFollowers: -1 }
            });
            res.redirect(`/user/${userId}`);

        }
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
};
module.exports.createNewPost = async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            res.redirect("/login");
        }
        let userId = req.params.userId;
        console.log(userId);
        res.render('user/newpost.ejs', { userId });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
};
module.exports.deletePost = async (req, res) => {
    let { userId, postId } = req.params;
    console.log(userId, postId);
    await User.findByIdAndUpdate(userId, { $inc: { nPost: -1 } });
    await User.findByIdAndUpdate(userId, { $pull: { post: postId } });
    await Post.findByIdAndDelete(postId);
    res.redirect(`/user/${userId}`);
};
module.exports.changePhoto = async (req, res) => {
    let id = req.params.id;
    const user = await User.findByIdAndUpdate(
        id,
        { profile: req.body.post });
    await user.save();
    res.redirect("/user");

};
module.exports.getChangePhoto = async (req, res) => {
    try {
        let userId = req.params.userId;
        let id = req.params.userId;
        res.render("user/change.ejs", { id });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
};