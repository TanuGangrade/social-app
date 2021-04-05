const {signup,signin,signout}=require('../controllers/auth')
const express=require('express')
const router=express.Router();
const {userSchemaValidator}=require("../validator/index")
const {userById}=require('../controllers/user')


router.post('/signup',userSchemaValidator,signup)
router.post('/signin',signin)
router.get('/signout',signout)

//authorization
//userById() will execute whenever we encounter a parameter called userId
router.param("userId",userById)

module.exports=router;
