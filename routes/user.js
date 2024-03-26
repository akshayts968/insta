const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/user.js")
const { userCheck, isLogin, userIn, followCheck } = require('../controllers/middleware/check.js');

router.get("/", wrapAsync(async (req, res) => {
    const users = await User.find();
    res.render("user/main.ejs", { users });
}));
router.get('/:userId/followers', followCheck, userController.followers);
router.get('/:userId/followings', followCheck, userController.followings);
router.post('/:userId/story', isLogin, userController.story);

router.get('/:userId', followCheck, userController.showUser);
router.post("/:userId", isLogin, userController.postUser);
router.delete('/:userId', followCheck, userController.deleteUser);
router.get('/:userId/newpost', userCheck, userController.createNewPost);
router.delete("/:userId/delete/:postId", userCheck, userController.deletePost);
router.post("/:id/change", userController.changePhoto);
router.get('/user/:userId/change', userCheck, userController.getChangePhoto);
module.exports = router;