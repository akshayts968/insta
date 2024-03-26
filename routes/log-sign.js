const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const authController=require("../controllers/auth.js")
router.get("/login",authController.getLogin);
router.get("/signup",authController.getSignup);
router.post("/signup",authController.postSignup);
router.post("/login",
passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,}),authController.postLogin);

module.exports=router;