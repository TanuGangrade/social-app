const {signup,signin,signout,forgotPassword,
    resetPassword}=require('../controllers/auth')
const express=require('express')
const router=express.Router();
const {userSchemaValidator,passwordResetValidator}=require("../validator/index")
const {userById}=require('../controllers/user')


router.post('/signup',userSchemaValidator,signup)
router.post('/signin',signin)
router.get('/signout',signout)
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);

//authorization
//userById() will execute whenever we encounter a parameter called userId
router.param("userId",userById)

module.exports=router;
