const User=require('../models/user')
const jwt=require('jsonwebtoken')
require('dotenv').config();
const expressJwt = require('express-jwt');


exports.signup=async(req,res)=>
{
        const userExists= await User.findOne({email:req.body.email})
    //this give true or false
    if(userExists)
    return res.send("email taken")

    const user=await new User(req.body)
    await user.save();
    res.send("we did it joe ")
} 

exports.signin=(req,res)=>{

    const {email, password}=req.body;
    //we try to find the user using email
    User.findOne({email:email},(err,founduser)=>
    {
        if(err||!founduser){
            return res.send("user dont exist brother");
        }
        //auth if pass match the email
        if(!founduser.authenticate(password)){
            return res.send("email and password dont match");
        }
        //generate token using jwt
        const token=jwt.sign({_id:founduser._id},process.env.JWT_SECRET)
        //keept the token in cookie 't' , with expiry date
        res.cookie("t",token,{expire:new Date()+9999})

        const {_id,name,email}=founduser
        return res.json({token,founduser:{_id,name,email}});

    }) 

}

exports.signout=(req,res)=>{
    res.clearCookie("t");
    return res.send("signed out bitxh")
}

exports.requireSignin = expressJwt({
    //if the token is valid, express jwt appends the verified users id
    // into the auth key of the request object. we can access auth.id
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
  });